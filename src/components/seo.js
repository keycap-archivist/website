/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbySeo } from 'gatsby-plugin-next-seo';

function SEO({ description, meta, title, img }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;
  const compiledTitle = `${site.siteMetadata.title} - ${title}`;

  return (
    <GatsbySeo
      title={compiledTitle}
      description={metaDescription}
      openGraph={{
        lang: 'en_US',
        title: compiledTitle,
        description: metaDescription,
        images: [{ url: img }],
        site_name: 'Keycap Archivist',
      }}
    />
  );
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
};

export default SEO;
