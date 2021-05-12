import { localStorageLoad, localStorageSet } from './misc';

const CONSTS = {
  config: 'config',
  displayMode: {
    tiles: 'tiles',
    list: 'list',
  },
};

const defaultConfig = {
  darkMode: false,
  displayMode: CONSTS.displayMode.tiles,
};

export function getDefaultConfig() {
  return { ...defaultConfig };
}

export function getConfig() {
  const c = localStorageLoad(CONSTS.config);
  if (c) {
    return JSON.parse(c);
  }
  return getDefaultConfig();
}

export function setConfig(config) {
  localStorageSet(CONSTS.config, JSON.stringify(config));
}
