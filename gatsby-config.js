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
  'gatsby-plugin-image',
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  'gatsby-transformer-remark',
  {
    resolve: 'gatsby-omni-font-loader',
    options: {
      enableListener: true,
      preconnect: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      web: [
        {
          name: 'Inter',
          file: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
];

// Purge CSS for prod deployement
if (process.env.TARGET === 'PROD') {
  plugins.push('gatsby-plugin-no-sourcemaps');
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
