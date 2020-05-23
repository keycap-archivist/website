const plugins = [
  'gatsby-plugin-next-seo',
  'gatsby-plugin-sitemap',
  'gatsby-plugin-postcss',
  'gatsby-plugin-sass',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/assets/img`,
    },
  },
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'blog',
      path: `${__dirname}/src/content/blog`,
    },
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-transformer-remark',
];

// Purge CSS for prod deployement
if (process.env.TARGET === 'PROD') {
  plugins.push({
    resolve: 'gatsby-plugin-purgecss',
    options: {
      printRejected: true, // Print removed selectors and processed file names
      develop: true, // Enable while using `gatsby develop`
      tailwind: true, // Enable tailwindcss support
      // whitelist: ['whitelist'], // Don't remove this selector
      // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
      // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
    },
  });
}

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'Keycap Archivist',
    description: '',
    author: '@keycap-archivist',
    siteUrl: 'https://keycap-archivist.com/',
  },
  plugins,
};
