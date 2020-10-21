const CONSTS = {
  wishlist: 'Wishlist',
  wishlistV2: 'Wishlist_v2',
};

function localStorageLoad(key) {
  if (localStorage) {
    return localStorage.getItem(key);
  }
  return null;
}

function localStorageSet(key, value) {
  if (localStorage) {
    localStorage.setItem(key, value);
  }
}
function localStorageDel(key) {
  if (localStorage) {
    localStorage.removeItem(key);
  }
}

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

function getDefaultWishlist() {
  return { ...defaultWishlist };
}

function setWishlist(wishlist) {
  localStorageSet(CONSTS.wishlistV2, JSON.stringify(wishlist));
}

function migratev1(w) {
  const newWish = getDefaultWishlist();
  w.items.forEach((c) => {
    newWish.items.push(c);
  });
  return newWish;
}

function getWishlist() {
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

function addCap(id) {
  const w = getWishlist();
  w.items.push({ id, prio: false });
  setWishlist(w);
  return w;
}

function rmCap(id) {
  const w = getWishlist();
  w.items = w.items.filter((x) => x.id !== id);
  setWishlist(w);
  return w;
}

function isInWishlist(w, id) {
  return w && w.items && w.items.findIndex((x) => x.id === id) > -1;
}

function addTradeCap(id) {
  const w = getWishlist();
  w.tradeItems.push({ id, prio: false });
  setWishlist(w);
  return w;
}

function rmTradeCap(id) {
  const w = getWishlist();
  w.tradeItems = w.tradeItems.filter((x) => x.id !== id);
  setWishlist(w);
  return w;
}

function isInTradeList(w, id) {
  return w && w.tradeItems && w.tradeItems.findIndex((x) => x.id === id) > -1;
}

module.exports = {
  getWishlist,
  setWishlist,
  addCap,
  rmCap,
  isInWishlist,
  addTradeCap,
  rmTradeCap,
  isInTradeList,
};
