import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Search from './search';
import Logo from '../assets/img/ka-logo.svg';
import useScrollPosition from '../hooks/useScrollPosition';
import ThemeSwitcher from './theme-switcher';
import { cn } from '../internal/twMerge';
import * as Collapsible from '@radix-ui/react-collapsible';

const Header = ({ siteTitle }) => {
  const isScrolled = useScrollPosition();
  const [isOpen, setIsOpen] = useState(false);

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
      <nav className="container flex w-full items-center justify-between gap-x-6 py-4 lg:justify-evenly">
        <div className="flex shrink-0 lg:flex-grow">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt={siteTitle} className="h-8 w-8 lg:h-10 lg:w-10" />
            <span className="ml-4 hidden text-lg font-bold uppercase text-slate-900 dark:text-white lg:inline-block">{siteTitle}</span>
          </Link>
        </div>
        <Search />
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen} className="block lg:hidden">
          <Collapsible.Trigger asChild>
            <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100 hover:text-gray-500">
              {isOpen ? <FontAwesomeIcon icon={['fas', 'xmark']} aria-hidden="true" /> : <FontAwesomeIcon icon={['fas', 'bars']} aria-hidden="true" />}{' '}
            </button>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <div className="container absolute inset-0 top-0 z-50 flex h-[32vh] w-full flex-col overflow-hidden bg-white dark:bg-slate-950 py-4 pt-6 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex shrink-0 lg:flex-grow">
                  <Link to="/" className="flex items-center">
                    <img src={Logo} alt={siteTitle} className="h-8 w-8 lg:h-10 lg:w-10" />
                    <span className="ml-4 hidden text-lg font-bold uppercase text-slate-900 dark:text-white lg:inline-block">{siteTitle}</span>
                  </Link>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 hover:bg-gray-100 hover:text-gray-500"
                >
                  <FontAwesomeIcon icon={['fas', 'xmark']} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flex w-full flex-col gap-y-1 font-semibold">
                {internalLinks.map((link) => {
                  if (link.isGatsbyLink) {
                    return (
                      <Link
                        key={link.name}
                        to={link.url}
                        className="py-1.5 text-sm text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
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
                      className="py-1.5 text-sm text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                    >
                      {link.name}
                    </a>
                  );
                })}
                <div className="flex items-center gap-x-5 pt-2">
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
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
        <div className="hidden basis-0 flex-wrap items-center lg:flex lg:flex-grow lg:flex-nowrap lg:justify-end">
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
