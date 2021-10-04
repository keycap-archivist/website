import { localStorageLoad, localStorageSet } from './misc';
import { getConfig, setConfig } from './config';
import { getCollections, setCollection, updateCollection } from './collection';

const CONSTS = {
  wishlist: 'Wishlist',
  wishlistV2: 'Wishlist_v2',
};

const defaultWishlist = {
  settings: {
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
  },
  items: [],
  tradeItems: [],
};

export const WishlistLimit = 50;
export const TradeListLimit = 10;

export function canAdd(type, wishlist) {
  switch (type) {
    case 'wish':
      return wishlist.items.length < WishlistLimit;
    case 'trade':
      return wishlist.tradeItems.length < TradeListLimit;
    default:
      throw Error('unknown type');
  }
}

export function getDefaultWishlist() {
  return { ...defaultWishlist };
}

export function setWishlist(wishlist) {
  localStorageSet(CONSTS.wishlistV2, JSON.stringify(wishlist));
  const cfg = getConfig();
  if (cfg.authorized && cfg.cloudAutoSync) {
    // eslint-disable-next-line no-use-before-define
    uploadSync(cfg);
  }
}

export function getWishlist() {
  const w2 = localStorageLoad(CONSTS.wishlistV2);
  if (w2) {
    try {
      return JSON.parse(w2);
    } catch (e) {
      console.log('Unable to read the Wishlist v2 object');
    }
  }
  const d = getDefaultWishlist();
  setWishlist(d);
  return d;
}

export function addCap(id) {
  const w = getWishlist();
  w.items.push({ id, prio: false });
  setWishlist(w);
  return w;
}

export function rmCap(id) {
  const w = getWishlist();
  w.items = w.items.filter((x) => x.id !== id);
  setWishlist(w);
  return w;
}

export function isInWishlist(w, id) {
  return w && w.items && w.items.findIndex((x) => x.id === id) > -1;
}

export function addTradeCap(id) {
  const w = getWishlist();
  w.tradeItems.push({ id, prio: false });
  setWishlist(w);
  return w;
}

export function rmTradeCap(id) {
  const w = getWishlist();
  w.tradeItems = w.tradeItems.filter((x) => x.id !== id);
  setWishlist(w);
  return w;
}

export function isInTradeList(w, id) {
  return w && w.tradeItems && w.tradeItems.findIndex((x) => x.id === id) > -1;
}

export async function uploadSync(cfg) {
  const wishlist = getWishlist();
  if (cfg.wishlist_id) {
    updateCollection(cfg.wishlist_id, {
      name: CONSTS.wishlistV2,
      wishlist,
    });
  } else {
    const id = await setCollection({
      name: CONSTS.wishlistV2,
      wishlist,
    });

    const config = { ...cfg, wishlist_id: id };

    setConfig(config);
  }
}

export async function downloadSync(cfg) {
  const collections = await getCollections();
  if (collections.length) {
    const config = { ...cfg, wishlist_id: collections[0].id };

    console.log(collections);
    localStorageSet(CONSTS.wishlistV2, JSON.stringify(collections[0].content));
    setConfig(config);
  }
}
