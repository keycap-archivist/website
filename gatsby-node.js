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

const slug = (d) => slugify(d, { replacement: '-', remove: /[.:?]/g, lower: true });

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

  /**
   * Blog
   */
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve('./src/layouts/blog-post.js'),
      context: {
        slug: node.fields.slug,
      },
    });
  });

  /**
   * Artisan catalog
   */
  const db = JSON.parse(fs.readFileSync('./src/db/catalog.json'));
  const makerTpl = require.resolve('./src/layouts/maker.js');
  const sculptTpl = require.resolve('./src/layouts/sculpt.js');
  db.forEach((maker) => {
    maker.sculpts.forEach((element) => {
      element.link = `maker/${slug(maker.name)}/${slug(element.name)}`;
      const rng = Math.floor(Math.random() * element.colorways.length);
      element.previewImg = element.colorways[rng].img;
    });
    const makerLightObj = _.cloneDeep(maker);
    makerLightObj.sculpts.forEach((s) => {
      delete s.colorways;
    });
    createPage({
      path: `maker/${slug(maker.name)}`,
      component: makerTpl,
      context: {
        maker: makerLightObj,
        type: 'maker',
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
          makerUrl: `maker/${slug(maker.name)}`,
          type: 'sculpt',
          sculpt,
          maker: outMaker,
        },
      });
    });
  });
};
