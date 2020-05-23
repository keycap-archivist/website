import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';

const Header = ({ siteTitle }) => (
  <header className="bg-blue-700 mb-3">
    <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-3 py-5">
      <h1 className="m-0 mb-5 md:mb-0">
        <Link to="/" className="text-xl font-bold text-white">
          {siteTitle}
        </Link>
      </h1>
      <div className="flex flex-row justify-between items-center relative w-full relative md:w-3/5 lg:w-2/5 ">
        <Search />
        <ul className="flex flex-row items-center list-none space-x-3">
          <li>
            <a
              href="https://github.com/keycap-archivist"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl"
            >
              <FontAwesomeIcon icon={['fab', 'github']} />
            </a>
          </li>
          <li>
            <a
              href="https://discord.gg/nXrShaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-xl"
            >
              <FontAwesomeIcon icon={['fab', 'discord']} />
            </a>
          </li>
        </ul>
      </div>
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
