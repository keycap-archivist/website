import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';

const Header = ({ siteTitle }) => (
  <header className="bg-blue-700 mb-3">
    <nav className="container flex flex-col md:flex-row items-center justify-between mx-auto px-3 py-5">
      <h1 className="flex items-center flex-shrink-0 text-white mr-6">
        <Link to="/" className="text-xl font-bold text-white">
          {siteTitle}
        </Link>
      </h1>
      <div className="w-full flex-grow block md:flex items-center md:w-auto">
        <div className="flex-grow mb-4 md:mb-0 pb-3">
          <Link to="/" className="block mt-4 inline-block lg:mt-0 text-white hover:text-teal-200 mr-4">
            Catalog
          </Link>
          <Link to="/wishlist" className="block mt-4 inline-block mt-0 text-white hover:text-teal-200 mr-4">
            Wishlist
          </Link>
        </div>
        <div className="mr-6 mb-2 md:mb-0">
          <Search />
        </div>
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
    </nav>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
