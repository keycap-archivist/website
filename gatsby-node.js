/* eslint-disable no-param-reassign */
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require('gatsby-source-filesystem');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const db = JSON.parse(fs.readFileSync('./src/db/catalog.json'));

const slug = (d) => slugify(d, { replacement: '-', remove: /[#,.:?()'"/]/g, lower: true }).toLowerCase();

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const nodeSlug = createFilePath({
      node,
      getNode,
      basePath: 'content\\blog',
    });
    createNodeField({
      node,
      name: 'slug',
      value: `blog${nodeSlug}`,
    });
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const makerTpl = require.resolve('./src/layouts/maker.js');
  const cwTpl = require.resolve('./src/layouts/cw.js');
  const sculptTpl = require.resolve('./src/layouts/sculpt.js');
  const blogTpl = path.resolve('./src/layouts/blog-post.js');
  /**
   * Blog
   */
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            excerpt(pruneLength: 250)
            html
            id
            fields {
              slug
            }
            frontmatter {
              date
              title
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: blogTpl,
      context: {
        content: node.html,
        title: node.frontmatter.title,
        date: node.frontmatter.date,
        slug: node.fields.slug,
      },
    });
  });

  /**
   * Artisan catalog
   */
  db.forEach((maker) => {
    maker.sculpts.forEach((element) => {
      element.link = `/maker/${slug(maker.name)}/${slug(element.name)}`;
      const rng = Math.floor(Math.random() * element.colorways.length);
      const f = element.colorways.find((x) => x.isCover === true);
      if (f) {
        element.previewImg = `https://cdn.keycap-archivist.com/keycaps/250/${f.id}.jpg`;
      } else {
        element.previewImg = `https://cdn.keycap-archivist.com/keycaps/250/${element.colorways[rng].id}.jpg`;
      }
    });
    const makerLightObj = _.cloneDeep(maker);
    makerLightObj.sculpts.forEach((s) => {
      delete s.colorways;
    });
    const makerUrl = `/maker/${slug(maker.name)}`;
    createPage({
      path: makerUrl,
      component: makerTpl,
      context: {
        maker: makerLightObj,
        selfOrder: maker.selfOrder,
        type: 'maker',
        slug: makerUrl,
      },
    });
    maker.sculpts.forEach((sculpt) => {
      // Light maker object
      const outMaker = {
        ...maker,
      };
      delete outMaker.sculpts;

      createPage({
        path: sculpt.link,
        component: sculptTpl,
        context: {
          makerUrl,
          denySubmission: maker.denySubmission,
          selfOrder: maker.selfOrder,
          type: 'sculpt',
          sculpt,
          maker: outMaker,
          slug: sculpt.link,
        },
      });
      sculpt.colorways.forEach((cw) => {
        createPage({
          path: `${sculpt.link}/${cw.id}`,
          component: cwTpl,
          context: {
            makerUrl,
            makerName: maker.name,
            sculptName: sculpt.name,
            sculptUrl: sculpt.link,
            type: 'colorway',
            colorway: cw,
            slug: `${sculpt.link}/${cw.id}`,
          },
        });
      });
    });
  });
};

exports.onCreateWebpackConfig = async ({ actions, plugins }) => {
  const revision = fs.readFileSync(path.join(__dirname, 'catalog-revision.txt'), 'utf-8');
  actions.setWebpackConfig({
    plugins: [plugins.define({ DBREV: JSON.stringify(revision) })],
  });
};
