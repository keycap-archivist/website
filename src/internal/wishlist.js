const CONSTS = {
  wishlist: 'Wishlist',
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

const defaultWishlist = {
  settings: {
    titleText: '',
    extraText: '',
    bg: 'Black',
    titleColor: 'Red',
    titlePolice: 'RedRock',
    textColor: 'White',
    extraTextColor: 'White',
    capsPerLine: 3,
  },
  items: [],
};

function getDefaultWishlist() {
  return { ...defaultWishlist };
}

function setWishlist(wishlist) {
  localStorageSet(CONSTS.wishlist, JSON.stringify(wishlist));
}

function getWishlist() {
  const w = localStorageLoad(CONSTS.wishlist);
  if (w) {
    try {
      return JSON.parse(w);
    } catch (e) {
      console.log('Unable to read the Wishlist object');
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

module.exports = {
  getWishlist,
  setWishlist,
  addCap,
  rmCap,
  isInWishlist,
};
