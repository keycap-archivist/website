/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const { createFilePath } = require('gatsby-source-filesystem');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

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
    createPage({
      path: `maker/${slug(maker.name)}`,
      component: makerTpl,
      context: {
        maker,
        type: 'maker',
      },
    });
    maker.sculpts.forEach((sculpt) => {
      createPage({
        path: `maker/${slug(maker.name)}/${slug(sculpt.name)}`,
        component: sculptTpl,
        context: {
          makerUrl: `maker/${slug(maker.name)}`,
          type: 'sculpt',
          sculpt,
          maker,
        },
      });
    });
  });
};
