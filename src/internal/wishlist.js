import { getCollections, setCollection, updateCollection } from './collection';
import { getConfig, setConfig } from './config';
import { localStorageLoad, localStorageSet } from './misc';

const CONSTS = {
  wishlist: 'Wishlist',
  wishlistV2: 'Wishlist_v2',
  wishlistV3: 'Wishlist_v3',
};

const defaultWishlist = {
  id: 0,
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
      text: 'My Wishlist',
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

export const defaultWishlistContainer = {
  activeWishlistId: 0,
  wishlists: [defaultWishlist],
};

export const WishlistContainerLimit = 10;
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

export function setWishlistContainer(wishlistContainer) {
  localStorageSet(CONSTS.wishlistV3, JSON.stringify(wishlistContainer));
  const cfg = getConfig();
  if (cfg.authorized && cfg.cloudAutoSync) {
    // eslint-disable-next-line no-use-before-define
    uploadSync(cfg);
  }
}

export function getWishlistContainer() {
  const w2 = localStorageLoad(CONSTS.wishlistV2);
  const w3 = localStorageLoad(CONSTS.wishlistV3);
  if (w3) {
    try {
      return JSON.parse(w3);
    } catch (e) {
      console.log('Unable to read the Wishlist v3 object');
    }
  } else if (w2) {
    try {
      const w2p = JSON.parse(w2);
      const w3u = {
        activeWishlistId: 0,
        wishlists: [
          {
            id: 0,
            ...w2p,
          },
        ],
      };
      w3u.wishlists[0].settings.title.text = 'My Wishlist';
      setWishlistContainer(w3u);
      return w3u;
    } catch (e) {
      console.log('Unable to read the Wishlist v2 object');
    }
  }
  setWishlistContainer(defaultWishlistContainer);
  return defaultWishlistContainer;
}

export function addWishlist() {
  const w = getWishlistContainer();
  if (w.wishlists.length < WishlistContainerLimit) {
    const usedIds = w.wishlists.map((wishlist) => wishlist.id);
    const firstUnusedId = Array.from({ length: usedIds.length + 1 }, (_, i) => i + 1).find((id) => !usedIds.includes(id));
    const newTitleText = `${defaultWishlist.settings.title.text} #${firstUnusedId}`;
    w.wishlists.push({
      ...defaultWishlist,
      id: firstUnusedId,
      settings: {
        ...defaultWishlist.settings,
        title: {
          text: newTitleText,
        },
      },
    });
    setWishlistContainer(w);
  }
  return w;
}

export function rmWishlist(wishlistId) {
  const w = getWishlistContainer();
  if (w.wishlists.length > 1) {
    w.wishlists = w.wishlists.filter((x) => x.id !== wishlistId);
    w.activeWishlistId = w.wishlists[0].id;
    setWishlistContainer(w);
  }
  return w;
}

export function addCap(capId) {
  const w = getWishlistContainer();
  w.wishlists.find((x) => x.id === w.activeWishlistId).items.push({ id: capId, prio: false });
  setWishlistContainer(w);
  return w;
}

export function rmCap(capId) {
  const w = getWishlistContainer();
  const wishlistIdx = w.wishlists.findIndex((x) => x.id === w.activeWishlistId);
  w.wishlists[wishlistIdx].items = w.wishlists[wishlistIdx].items.filter((x) => x.id !== capId);
  setWishlistContainer(w);
  return w;
}

export function isInWishlist(w, id) {
  return w && w.items && w.items.findIndex((x) => x.id === id) > -1;
}

export function addTradeCap(capId) {
  const w = getWishlistContainer();
  w.wishlists.find((x) => x.id === w.activeWishlistId).tradeItems.push({ id: capId, prio: false });
  setWishlistContainer(w);
  return w;
}

export function rmTradeCap(capId) {
  const w = getWishlistContainer();
  const wishlistIdx = w.wishlists.findIndex((x) => x.id === w.activeWishlistId);
  w.wishlists[wishlistIdx].tradeItems = w.wishlists[wishlistIdx].tradeItems.filter((x) => x.id !== capId);
  setWishlistContainer(w);
  return w;
}

export function isInTradeList(w, id) {
  return w && w.tradeItems && w.tradeItems.findIndex((x) => x.id === id) > -1;
}

export async function uploadSync(cfg) {
  const w = getWishlistContainer();
  if (cfg.wishlist_id) {
    updateCollection(cfg.wishlist_id, {
      name: CONSTS.wishlistV3,
      w,
    });
  } else {
    const id = await setCollection({
      name: CONSTS.wishlistV3,
      w,
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
    if (collections[0].content.wishlists) {
      localStorageSet(CONSTS.wishlistV3, JSON.stringify(collections[0].content));
    } else {
      localStorageSet(CONSTS.wishlistV2, JSON.stringify(collections[0].content));
    }
    setConfig(config);
  }
}
