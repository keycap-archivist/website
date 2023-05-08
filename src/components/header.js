import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';
import Logo from '../assets/img/ka-logo.svg';

const Header = ({ siteTitle, darkMode }) => {
  const themeClass = darkMode ? 'dark' : 'light';

  return (
    <header className={`mb-3 bg-blue_ka ${themeClass}`}>
      <nav className="container mx-auto flex flex-col items-center justify-between px-3 py-5 md:flex-row">
        <h1 className="mb-2 flex shrink-0 items-center text-white md:mb-0">
          <Link to="/" className="flex flex-row items-center text-xl font-bold text-white">
            <img src={Logo} alt={siteTitle} width="40" height="40" className="mr-2" />
            {siteTitle}
          </Link>
        </h1>
        <div className="md:flex-no-wrap flex w-full flex-row flex-wrap items-center justify-center md:justify-end">
          <div className="flex-no-wrap mr-3 flex flex-row items-stretch md:mr-6">
            <Link to="/wishlist" className="mr-3 text-white hover:text-teal-200 md:mr-6">
              Wishlist
            </Link>
            <a href="https://ko-fi.com/keycaparchivist" target="_blank" rel="noopener noreferrer" className="mr-3 text-white hover:text-teal-200 md:mr-6">
              Donate
            </a>
            <Link to="/config" className="mr-3 text-white hover:text-teal-200 md:mr-6">
              Config
            </Link>
            <Link to="/about" className="text-white hover:text-teal-200">
              About
            </Link>
          </div>
          <ul
            className="
          flex
          list-none
          flex-row
          items-center
          justify-center
          space-x-3
          md:mr-6
          md:justify-start
          md:space-x-6"
          >
            <li>
              <a href="https://github.com/keycap-archivist" target="_blank" rel="noopener noreferrer" className="text-xl text-white hover:text-teal-200">
                <FontAwesomeIcon icon={['fab', 'github']} />
              </a>
            </li>
            <li>
              <a href="https://discord.gg/nXrShaa" target="_blank" rel="noopener noreferrer" className="text-xl text-white hover:text-teal-200">
                <FontAwesomeIcon icon={['fab', 'discord']} />
              </a>
            </li>
          </ul>
          <div className="mt-4 w-full md:mt-0 md:w-1/3">
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
