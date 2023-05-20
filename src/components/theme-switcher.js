import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { getConfig, setConfig } from '../internal/config';
import clsx from 'clsx';

const ThemeSwitcher = (props) => {
  const [config, setStateConfig] = useState(getConfig());

  const setComponentConfig = (property, value) => {
    config[property] = value;
    setConfig(config);
    setStateConfig({ ...config });
  };

  const onClick = () => {
    setComponentConfig('darkMode', !config.darkMode);
    config.darkMode ? localStorage.setItem('theme', 'dark') : localStorage.setItem('theme', 'light');

    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <button
      className={clsx(
        props.className,
        'inline-flex items-center justify-center rounded-md border border-slate-200 p-2 text-sm font-medium ring-offset-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-slate-300/20 hover:text-slate-900 dark:border-slate-600 dark:hover:text-slate-100',
      )}
      onClick={onClick}
    >
      {config.darkMode ? <FontAwesomeIcon icon={['fa', 'moon']} /> : <FontAwesomeIcon icon={['fa', 'sun']} />}
    </button>
  );
};

export default ThemeSwitcher;
