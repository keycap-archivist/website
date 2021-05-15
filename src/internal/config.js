import { localStorageLoad, localStorageSet } from './misc';

const isBrowser = typeof window !== 'undefined';

const CONSTS = {
  config: 'config',
  displayMode: {
    tiles: 'tiles',
    list: 'list',
  },
};

const defaultConfig = {
  darkMode: isBrowser && !!window.matchMedia('(prefers-color-scheme: dark)').matches,
  displayMode: CONSTS.displayMode.tiles,
};

export function getDefaultConfig() {
  return { ...defaultConfig };
}

export function getConfig() {
  const c = localStorageLoad(CONSTS.config);
  if (c) {
    try {
      return JSON.parse(c);
    } catch (e) {
      console.error('Unable to read Config', e);
      console.log(c);
    }
  }
  return getDefaultConfig();
}

export function setConfig(config) {
  localStorageSet(CONSTS.config, JSON.stringify(config));
}

export function initConfig() {
  if (!localStorageLoad(CONSTS.config)) {
    setConfig(getDefaultConfig());
  }
}
