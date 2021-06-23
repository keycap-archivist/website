import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';
import Logo from '../assets/img/ka-logo.svg';

const Header = ({ siteTitle, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';

  return (
    <header className={`bg-blue_ka mb-3 ${themeClass}`}>
      <nav className="container flex flex-col md:flex-row items-center justify-between mx-auto px-3 py-5">
        <h1 className="flex items-center flex-shrink-0 mb-2 md:mb-0 text-white">
          <Link to="/" className="text-xl font-bold text-white flex flex-row items-center">
            <img src={Logo} alt={siteTitle} width="40" height="40" className="mr-2" />
            {siteTitle}
          </Link>
        </h1>
        <div className="w-full flex flex-row flex-wrap md:flex-no-wrap items-center justify-center md:justify-end">
          <div className="flex flex-row flex-no-wrap items-stretch mr-3 md:mr-6">
            <Link to="/collection" className="text-white hover:text-teal-200 mr-3 md:mr-6">
              Collection
            </Link>
            <Link to="/wishlist" className="text-white hover:text-teal-200 mr-3 md:mr-6">
              Wishlist
            </Link>
            <Link to="/blog" className="text-white hover:text-teal-200 mr-3 md:mr-6">
              Blog
            </Link>
            <a href="https://ko-fi.com/keycaparchivist" target="_blank" rel="noopener noreferrer" className="text-white hover:text-teal-200 mr-3 md:mr-6">
              Donate
            </a>
            <Link to="/config" className="text-white hover:text-teal-200 mr-3 md:mr-6">
              Config
            </Link>
            <Link to="/about" className="text-white hover:text-teal-200">
              About
            </Link>
          </div>
          <ul
            className="
          flex
          flex-row
          items-center
          list-none
          space-x-3
          md:space-x-6
          justify-center
          md:justify-start
          md:mr-6"
          >
            <li>
              <a href="https://github.com/keycap-archivist" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-teal-200">
                <FontAwesomeIcon icon={['fab', 'github']} />
              </a>
            </li>
            <li>
              <a href="https://discord.gg/nXrShaa" target="_blank" rel="noopener noreferrer" className="text-white text-xl hover:text-teal-200">
                <FontAwesomeIcon icon={['fab', 'discord']} />
              </a>
            </li>
          </ul>
          <div className="w-full md:w-1/3 mt-4 md:mt-0">
            <Search />
          </div>
        </div>
      </nav>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: '',
};

export default Header;
