/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const slugify = require('slugify');
// const axios = require('axios');
const fs = require('fs');

const slug = (d) =>
  slugify(d, { replacement: '-', remove: /[.:?]/g, lower: true });

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
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
          type: 'sculpt',
          sculpt,
        },
      });
    });
  });
};
