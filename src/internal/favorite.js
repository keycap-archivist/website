import { localStorageLoad, localStorageSet } from './misc';

const CONSTS = {
  favoriteMakers: 'favoriteMakers',
};

export function getFavoriteMakers() {
  const makers = [];
  const m = localStorageLoad(CONSTS.favoriteMakers);
  if (m) {
    try {
      return JSON.parse(m);
    } catch (e) {
      console.error('Unable to read favorite makers', e);
      console.log(m);
    }
  }
  return makers;
}

export function addFavMaker(maker) {
  const makers = getFavoriteMakers();

  const exist = makers.find((m) => m === maker);
  if (!exist) {
    makers.push(maker);
    localStorageSet(CONSTS.favoriteMakers, JSON.stringify(makers));
  }

  return makers;
}

export function removeFavMaker(maker) {
  let makers = getFavoriteMakers();

  makers = makers.filter((m) => m !== maker);
  localStorageSet(CONSTS.favoriteMakers, JSON.stringify(makers));

  return makers;
}
