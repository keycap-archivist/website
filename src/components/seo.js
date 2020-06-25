import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbySeo } from 'gatsby-plugin-next-seo';
import { globalHistory as history } from '@reach/router';

function SEO({ description, title, img }) {
  const { location } = history;
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
  const compiledTitle = title ? `${title} | ${site.siteMetadata.title}` : site.siteMetadata.title;

  return (
    <GatsbySeo
      title={compiledTitle}
      description={metaDescription}
      openGraph={{
        lang: 'en_US',
        title: compiledTitle,
        description: metaDescription,
        images: [{ url: `${location.href}${img}` }],
        site_name: 'Keycap Archivist',
        type: 'website',
        url: location.href,
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
