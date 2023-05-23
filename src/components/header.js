import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';
import Logo from '../assets/img/ka-logo.svg';
import useScrollPosition from '../hooks/useScrollPosition';
import ThemeSwitcher from './theme-switcher';
import { getConfig, setConfig } from '../internal/config';
import { cn } from '../internal/twMerge';

const Header = ({ siteTitle }) => {
  const isScrolled = useScrollPosition();
  const [config, setStateConfig] = useState(getConfig());

  const internalLinks = [
    {
      name: 'Wishlist',
      url: '/wishlist',
      isGatsbyLink: true,
    },
    {
      name: 'Donate',
      url: 'https://ko-fi.com/keycaparchivist',
      isGatsbyLink: false,
    },
    {
      name: 'Config',
      url: '/config',
      isGatsbyLink: true,
    },
    {
      name: 'About',
      url: '/about',
      isGatsbyLink: true,
    },
  ];

  const socialLinks = [
    {
      name: 'Github',
      url: 'https://github.com/keycap-archivist',
      iconName: 'github',
    },
    {
      name: 'Discord',
      url: 'https://discord.gg/nXrShaa',
      iconName: 'discord',
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mb-6 bg-white shadow-md shadow-slate-900/5 transition duration-300 dark:shadow-none',
        isScrolled ? 'dark:bg-slate-950/95 dark:backdrop-blur-md dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/80' : 'dark:bg-transparent',
      )}
    >
      <nav className="container flex w-full flex-col items-center py-4 md:flex-row">
        <div className="flex shrink-0 basis-0  md:flex-grow">
          <Link to="/" className="mb-2 flex items-center md:mb-0">
            <img src={Logo} alt={siteTitle} width="40" height="40" className="mr-4" />
            <span className="text-lg font-bold uppercase text-slate-900 dark:text-white">{siteTitle}</span>
          </Link>
        </div>
        <div className="mt-4 flex items-center md:mt-0">
          <Search />
        </div>
        <div className="flex basis-0 flex-wrap items-center md:flex-grow md:flex-nowrap md:justify-end">
          <div className="flex items-center gap-x-5 font-semibold">
            {internalLinks.map((link) => {
              if (link.isGatsbyLink) {
                return (
                  <Link
                    key={link.name}
                    to={link.url}
                    className="text-sm text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                >
                  {link.name}
                </a>
              );
            })}
          </div>
          <div className="ml-5 flex items-center gap-x-5 border-l border-slate-200 pl-6 dark:border-slate-700">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
              >
                <FontAwesomeIcon icon={['fab', link.iconName]} />
              </a>
            ))}
            <ThemeSwitcher className="-ml-[6px]" />
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
