import { localStorageDel, localStorageLoad, localStorageSet } from './misc';

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

export function getDefaultWishlist() {
  return { ...defaultWishlist };
}

export function setWishlist(wishlist) {
  localStorageSet(CONSTS.wishlistV2, JSON.stringify(wishlist));
}

function migratev1(w) {
  const newWish = getDefaultWishlist();
  w.items.forEach((c) => {
    newWish.items.push(c);
  });
  return newWish;
}

export function getWishlist() {
  // Temporary migration step
  const w = localStorageLoad(CONSTS.wishlist);
  if (w) {
    try {
      const v1Wish = JSON.parse(w);
      const newWish = migratev1(v1Wish);
      localStorageDel(CONSTS.wishlist);
      setWishlist(newWish);
      return newWish;
    } catch (e) {
      console.log('Unable to read the Wishlist object');
    }
  }
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
