const plugins = [
  {
    resolve: 'gatsby-plugin-google-analytics',
    options: {
      trackingId: 'UA-169271859-1',
      head: false,
      anonymize: true,
    },
  },
  'gatsby-plugin-pnpm',
  'gatsby-plugin-next-seo',
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      output: '/sitemap.xml',
      query: `
      {
        allSitePage {
          nodes {
            path
          }
        }
    }`,
      resolveSiteUrl: () => 'https://keycap-archivist.com/',
      serialize: ({ path }) => {
        // Forced to due this because of Github pages default behaviour
        // otherwise the server returns a 301 HTTP code.
        let url = path;
        if (!url.endsWith('/')) {
          url += '/';
        }
        return {
          url: `https://keycap-archivist.com${url}`,
          changefreq: 'daily',
          priority: 0.7,
        };
      },
    },
  },
  {
    resolve: 'gatsby-plugin-robots-txt',
    options: {
      host: 'https://keycap-archivist.com/',
      sitemap: 'https://keycap-archivist.com/sitemap.xml',
      policy: [{ userAgent: '*', allow: '/' }],
    },
  },
  {
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: 'https://keycap-archivist.com/',
    },
  },
  'gatsby-plugin-postcss',
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/assets/img`,
    },
  },
  'gatsby-transformer-sharp',
  'gatsby-plugin-sharp',
  'gatsby-transformer-remark',
  {
    resolve: 'gatsby-plugin-web-font-loader',
    options: {
      google: {
        families: ['Asap:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap'],
      },
    },
  },
];

// Purge CSS for prod deployement
if (process.env.TARGET === 'PROD') {
  plugins.push('gatsby-plugin-no-sourcemaps');
  plugins.push({
    resolve: 'gatsby-plugin-purgecss',
    options: {
      printRejected: true, // Print removed selectors and processed file names
      develop: true, // Enable while using `gatsby develop`
      tailwind: true, // Enable tailwindcss support
      // whitelist: ['whitelist'], // Don't remove this selector
      ignore: ['@fortawesome/fontawesome-svg-core/styles.css'], // Ignore files/folders
      // purgeOnly : ['components/', '/main.css', 'bootstrap/'], // Purge only these files/folders
    },
  });
}

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'Keycap Archivist',
    description: 'The community driven artisan mechanical keyboard keycap catalog',
    author: '@keycap-archivist',
    siteUrl: 'https://keycap-archivist.com/',
    generationDate: new Date(),
  },
  plugins,
};
