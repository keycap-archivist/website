import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({ siteTitle }) => (
  <header
    style={{
      background: 'rebeccapurple',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
        <a
          href="https://github.com/keycap-archivist"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={['fab', 'github']} />
        </a>
        <a
          href="https://discord.gg/nXrShaa"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={['fab', 'discord']} />
        </a>
      </h1>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
