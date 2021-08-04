import { localStorageDel, localStorageLoad, localStorageSet } from './misc';

const CONSTS = {
  wishlistV2: 'Wishlist_v2',
  wish: 'KA_Wish',
  trade: 'KA_Trade',
  settings: 'KA_Settings',
};

export const defaultSettings = {
  capsPerLine: 3,
  priority: {
    color: 'Red',
    font: 'Roboto',
  },
  legends: {
    color: 'Red',
    font: 'Roboto',
  },
  title: {
    color: 'Red',
    font: 'Roboto',
    text: '',
  },
  tradeTitle: {
    color: 'Red',
    font: 'Roboto',
    text: '',
  },
  extraText: {
    color: 'Red',
    font: 'Roboto',
    text: '',
  },
  background: {
    color: 'Black',
  },
  social: {
    reddit: '',
    discord: '',
  },
};

const defaultWishlist = {
  items: [],
};

export function getDefaultWishlist() {
  return { ...defaultWishlist };
}

export function setWishlist(wishlist, wishlistId) {
  switch (wishlistId) {
    case 'wish':
      localStorageSet(CONSTS.wish, JSON.stringify(wishlist));
      break;
    case 'trade':
      localStorageSet(CONSTS.trade, JSON.stringify(wishlist));
      break;
    default:
      break;
  }
}

export function getWishlist(wishlistId) {
  const ws = localStorageLoad(CONSTS[wishlistId]);
  if (ws) {
    try {
      return JSON.parse(ws);
    } catch (e) {
      console.log('Unable to read the Wishlist v2 object');
    }
  }
  const d = getDefaultWishlist();
  setWishlist(d, wishlistId);
  return d;
}

export function getLocalCollections() {
  return [
    {
      content: getWishlist('wish'),
      name: 'Wishlist',
      id: 'wish',
    },
    {
      content: getWishlist('trade'),
      name: 'Tradelist',
      id: 'trade',
    },
  ];
}

export function initMigrateWishlist() {
  let ws = localStorageLoad(CONSTS.wishlistV2);
  if (ws) {
    try {
      ws = JSON.parse(ws);
      localStorageSet(CONSTS.wish, JSON.stringify({ items: ws.items }));
      localStorageSet(CONSTS.trade, JSON.stringify({ items: ws.tradeItems }));
      localStorageSet(CONSTS.settings, JSON.stringify(ws.settings));

      localStorageDel(CONSTS.wishlistV2);
    } catch (e) {
      console.log('Unable to read the Wishlist v2 object');
    }
  }
}
