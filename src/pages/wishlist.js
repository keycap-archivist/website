import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

import flip from '../assets/img/flip-machine.png';
import ConfirmDialogModal from '../components/modals/confirm-dialog';
import SEO from '../components/seo';
import { cssColors } from '../internal/misc';
import {
  addWishlist,
  defaultWishlistContainer,
  getWishlistContainer,
  rmCap,
  rmTradeCap,
  rmWishlist,
  setWishlistContainer,
  WishlistContainerLimit,
} from '../internal/wishlist';
import Layout from '../layouts/base';
// import BkMaggle from '../assets/img/bkmaggle.png';

const baseAPIurl = 'https://api.keycap-archivist.com/wishlist';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistContainer, setStateWishlist] = useState(defaultWishlistContainer);
  const [fonts] = useState(['BebasNeue', 'PermanentMarker', 'Roboto', 'RedRock']);
  const wishlist = wishlistContainer.wishlists.find((x) => x.id === wishlistContainer.activeWishlistId);
  const [showWishlistDeleteModal, setShowWishlistDeleteModal] = useState(false);

  // Required for SSR
  useEffect(() => {
    setStateWishlist(getWishlistContainer());
  }, []);

  const loadingPlaceholder = () => {
    if (wishlistLoading) {
      return (
        <div className="text-center">
          <p className="animate-pulse text-lg">Currently loading</p>
          <img src={flip} className="mx-auto max-w-half animate-spin-slow animate-pulse" />
        </div>
      );
    }
    return '';
  };

  const errorPlaceholder = () => {
    if (errorLoading) {
      let content = 'Something terrible happened';
      if (typeof errorLoading === 'string') {
        content = errorLoading;
      }
      return <div className="text-center">{content}</div>;
    }
    return '';
  };

  // prettier and eslint are dumb on this somehow
  // eslint-disable-next-line no-confusing-arrow
  const imgPlaceholder = () => (b64Img && !wishlistLoading ? <img src={`data:image/png;base64,${b64Img}`} className="mx-auto max-w-full" /> : '');

  const genWishlist = async () => {
    setB64Img(null);
    setErrorLoading(false);
    setWishlistLoading(true);

    const outWishlist = { settings: wishlist.settings };
    outWishlist.capsPerLine = parseInt(outWishlist.capsPerLine, 10);
    outWishlist.tradeCaps = wishlist.tradeItems.map((i) => ({
      id: i.id,
      legendColor: wishlist.settings.tradeTitle.color,
    }));
    outWishlist.caps = wishlist.items.map((i) => ({
      id: i.id,
      isPriority: i.prio,
      legendColor: wishlist.settings.title.color,
    }));

    // Check wishlist
    const checkResult = await axios
      .post(`${baseAPIurl}/check`, outWishlist)
      .then((d) => d.data)
      .catch((e) => {
        console.log(JSON.stringify(e));
        return {
          critical: true,
          log: e,
          stack: e.stack,
          data: e.config.data,
        };
      });
    if (checkResult.critical) {
      setErrorLoading(`A critical error happened:${checkResult.log}\r\n${checkResult.stack}\r\n${checkResult.data}`);
      setWishlistLoading(false);
      return;
    }
    if (checkResult.hasError) {
      let wl;
      for (const c of checkResult.errors) {
        if (outWishlist.caps.findIndex((x) => x.id === c)) {
          wl = rmCap(c);
        }
        if (outWishlist.tradeCaps.findIndex((x) => x.id === c)) {
          wl = rmTradeCap(c);
        }
      }
      setStateWishlist(wl);
      setErrorLoading('Some keycaps were not found in the database. We cleaned up your wishlist. Please try again');
      setWishlistLoading(false);
      return;
    }
    await axios
      .post(`${baseAPIurl}/generate`, outWishlist)
      .then((d) => d.data)
      .then((r) => {
        setB64Img(r.Body);
      })
      .catch((e) => {
        console.log(e);
        setErrorLoading(`A critical error happened:${e}\r\n${e.stack}\r\n${e.config.data}`);
      });
    setWishlistLoading(false);
  };

  const setPriority = (capId, priority) => {
    const idxWishlist = wishlistContainer.wishlists.findIndex((x) => x.id === wishlistContainer.activeWishlistId);
    const idxCap = wishlistContainer.wishlists[idxWishlist].items.findIndex((x) => x.id === capId);
    wishlistContainer.wishlists[idxWishlist].items[idxCap].prio = priority;
    setWishlistContainer(wishlistContainer);
    setStateWishlist({ ...wishlistContainer });
  };

  const setSettingWishlist = (property, key, e) => {
    const idxWishlist = wishlistContainer.wishlists.findIndex((x) => x.id === wishlistContainer.activeWishlistId);
    const newWishlistContainer = JSON.parse(JSON.stringify(wishlistContainer)); // make a deep copy of the object
    if (property === 'capsPerLine') {
      newWishlistContainer.wishlists[idxWishlist].settings.capsPerLine = e.target.value;
    } else {
      newWishlistContainer.wishlists[idxWishlist].settings[property][key] = e.target.value;
    }
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
  };

  const setActiveWishlist = (e) => {
    setB64Img(null);
    wishlistContainer.activeWishlistId = parseInt(e.target.value, 10);
    setWishlistContainer(wishlistContainer);
    setStateWishlist({ ...wishlistContainer });
  };

  const addNewWishlist = () => {
    setB64Img(null);
    const newWishlistContainer = addWishlist();
    newWishlistContainer.activeWishlistId = newWishlistContainer.wishlists[newWishlistContainer.wishlists.length - 1].id;
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
  };

  const deleteActiveWishlist = () => {
    setB64Img(null);
    const newWishlistContainer = rmWishlist(wishlistContainer.activeWishlistId);
    newWishlistContainer.activeWishlistId = newWishlistContainer.wishlists[newWishlistContainer.wishlists.length - 1].id;
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
    setShowWishlistDeleteModal(false);
  };

  const wishlistSettings = () => (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="activeWishlist">
              Active Wishlist
            </label>
            <select
              id="activeWishlist"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.id}
              onChange={(e) => setActiveWishlist(e)}
            >
              {wishlistContainer.wishlists.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.settings.title.text} - {x.items.length + x.tradeItems.length} Items
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2 flex justify-center">
            <button
              id="addWishlist"
              onClick={addNewWishlist}
              className={`w-2/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-7 disabled:bg-gray-600 ${
                (wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit) && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit}
            >
              Add New Wishlist
            </button>
          </div>
          <div className="w-1/3 pr-2 flex justify-center">
            <button
              id="delWishlist"
              onClick={() => setShowWishlistDeleteModal(true)}
              className={`w-2/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-7 disabled:bg-gray-600 ${
                (wishlistLoading || wishlistContainer.wishlists.length <= 1) && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading || wishlistContainer.wishlists.length <= 1}
            >
              Delete Active Wishlist
            </button>
          </div>
        </div>
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="capsPerLine">
              No. Keycaps Per Line
            </label>
            <input
              id="capsPerLine"
              value={wishlist.settings.capsPerLine}
              onChange={(e) => setSettingWishlist('capsPerLine', '', e)}
              className="shadow appearance-none border border-gray-100 rounded
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              type="number"
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="priorityColor">
              Priority Color
            </label>
            <select
              id="priorityColor"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.priority.color}
              onChange={(e) => setSettingWishlist('priority', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="priorityFont">
              Priority Font
            </label>
            <select
              id="priorityFont"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.priority.font}
              onChange={(e) => setSettingWishlist('priority', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="legendsFont">
              Legends Font
            </label>
            <select
              id="legendsFont"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.legends.font}
              onChange={(e) => setSettingWishlist('legends', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="legendsColor">
              Legends Color
            </label>
            <select
              id="legendsColor"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.legends.color}
              onChange={(e) => setSettingWishlist('legends', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="backgroundColor">
              Background Color
            </label>
            <select
              id="backgroundColor"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.background.color}
              onChange={(e) => setSettingWishlist('background', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {wishlist.tradeItems.length ? (
        <div className="mb-4">
          <div className="flex flex-wrap mt-2">
            <div className="w-1/3 pr-2">
              <label className="block text-gray-700 border-gray-100 text-sm font-bold mb-2" htmlFor="tradeTitleText">
                Trade Text
              </label>
              <input
                className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
                id="tradeTitleText"
                type="text"
                value={wishlist.settings.tradeTitle.text}
                onChange={(e) => setSettingWishlist('tradeTitle', 'text', e)}
                placeholder="Have"
              />
            </div>
            <div className="w-1/3 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleColor">
                Trade Title Color
              </label>
              <select
                id="tradeTitleColor"
                className="shadow appearance-none border border-gray-100
                rounded w-full py-2 px-3 text-gray-700 leading-tight
                focus:outline-none focus:shadow-outline"
                type="select"
                value={wishlist.settings.tradeTitle.color}
                onChange={(e) => setSettingWishlist('tradeTitle', 'color', e)}
              >
                {cssColors.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleFont">
                Trade Title Font
              </label>
              <select
                id="tradeTitleFont"
                className="shadow appearance-none border
                border-gray-100
                rounded w-full py-2 px-3 text-gray-700
                leading-tight
                focus:outline-none focus:shadow-outline"
                type="select"
                value={wishlist.settings.tradeTitle.font}
                onChange={(e) => setSettingWishlist('tradeTitle', 'font', e)}
              >
                {fonts.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}

      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleText">
              Title
            </label>
            <input
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="titleText"
              type="text"
              value={wishlist.settings.title.text}
              maxLength="50"
              onChange={(e) => setSettingWishlist('title', 'text', e)}
              placeholder={wishlist.tradeItems.length ? 'Want' : 'Wishlist'}
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleColor">
              Title Color
            </label>
            <select
              id="titleColor"
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.title.color}
              onChange={(e) => setSettingWishlist('title', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleFont">
              Title Font
            </label>
            <select
              id="titleFont"
              className="shadow appearance-none border
              border-gray-100
              rounded w-full py-2 px-3 text-gray-700
              leading-tight
              focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.title.font}
              onChange={(e) => setSettingWishlist('title', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraText">
              Extra Text
            </label>
            <input
              className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="extraText"
              type="text"
              maxLength="50"
              value={wishlist.settings.extraText.text}
              onChange={(e) => setSettingWishlist('extraText', 'text', e)}
              placeholder="Willing to topup if needed"
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraColor">
              Extra Color
            </label>
            <select
              id="extraColor"
              className="shadow appearance-none border border-gray-100
                rounded w-full py-2 px-3 text-gray-700 leading-tight
                focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.extraText.color}
              onChange={(e) => setSettingWishlist('extraText', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraFont">
              Extra Font
            </label>
            <select
              id="extraFont"
              className="shadow appearance-none border
                border-gray-100
                rounded w-full py-2 px-3 text-gray-700
                leading-tight
                focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.extraText.font}
              onChange={(e) => setSettingWishlist('extraText', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/2 pr-2">
            <label className="wishlist_font" htmlFor="socialReddit">
              Reddit
            </label>
            <input
              className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="socialReddit"
              type="text"
              value={wishlist.settings.social.reddit}
              onChange={(e) => setSettingWishlist('social', 'reddit', e)}
              placeholder="u/username"
            />
          </div>
          <div className="w-1/2 pr-2">
            <label className="wishlist_font" htmlFor="socialDiscord">
              Discord
            </label>
            <input
              className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="socialDiscord"
              type="text"
              value={wishlist.settings.social.discord}
              onChange={(e) => setSettingWishlist('social', 'discord', e)}
              placeholder="Discord#1234"
            />
          </div>
        </div>
      </div>
    </>
  );

  const wishlistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="mt-6"
        list={wishlist ? wishlist.items : []}
        setList={(e) => {
          // Update the state of the component only
          const activeWishlistIndex = wishlistContainer.wishlists.findIndex((w) => w.id === wishlistContainer.activeWishlistId);
          const activeWishlistCopy = { ...wishlistContainer.wishlists[activeWishlistIndex] };
          activeWishlistCopy.items = e;
          const wishlistContainerCopy = { ...wishlistContainer };
          wishlistContainerCopy.wishlists[activeWishlistIndex] = activeWishlistCopy;
          setStateWishlist(wishlistContainerCopy);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlistContainer(wishlistContainer);
        }}
      >
        {wishlist.items.map((x) => (
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="cursor-move handle inline-block text-3xl mr-6" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`}
              className="cursor-move handle inline-block rounded-lg max-h-full mr-6"
            />
            <span></span>
            {x.prio ? (
              <button
                onClick={() => setPriority(x.id, false)}
                className="bg-red-500
                  hover:bg-red-700
                  text-white
                  font-bold
                  py-1
                  px-2
                  border
                  border-red-700
                  rounded
                  inline-block
                  mr-6"
              >
                <FontAwesomeIcon id="removePriority" className="m-1 arrow-down-icon cursor-pointer" icon={['fas', 'sort-numeric-down']} />
              </button>
            ) : (
              <button
                onClick={() => setPriority(x.id, true)}
                className="bg-green-500
                  hover:bg-green-700
                  text-white
                  font-bold
                  py-1 px-2
                  border
                  border-green-700
                  rounded
                  inline-block mr-6"
              >
                <FontAwesomeIcon id="addPriority" className="m-1 arrow-up-icon cursor-pointer" icon={['fas', 'sort-numeric-up']} />
              </button>
            )}
            <button
              onClick={() => setStateWishlist(rmCap(x.id))}
              className="bg-red-500
                hover:bg-red-700
                text-white
                font-bold
                py-1
                px-2
                border
                border-red-700
                rounded
                inline-block
                mr-6"
            >
              <FontAwesomeIcon id="removeWishlist" className="m-1 trash-alt-icon cursor-pointer" icon={['fas', 'trash-alt']} />
            </button>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  const tradelistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="mt-6"
        list={wishlist ? wishlist.tradeItems : []}
        setList={(e) => {
          // Update the state of the component only
          const activeWishlistIndex = wishlistContainer.wishlists.findIndex((w) => w.id === wishlistContainer.activeWishlistId);
          const activeWishlistCopy = { ...wishlistContainer.wishlists[activeWishlistIndex] };
          activeWishlistCopy.tradeItems = e;
          const wishlistContainerCopy = { ...wishlistContainer };
          wishlistContainerCopy.wishlists[activeWishlistIndex] = activeWishlistCopy;
          setStateWishlist(wishlistContainerCopy);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlistContainer(wishlistContainer);
        }}
      >
        {wishlist.tradeItems.map((x) => (
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="cursor-move handle inline-block text-3xl mr-6" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`}
              className="cursor-move handle inline-block rounded-lg max-h-full mr-6"
            />
            <span></span>
            <button
              onClick={() => setStateWishlist(rmTradeCap(x.id))}
              className="bg-red-500
              hover:bg-red-700
              text-white
              font-bold
              py-1
              px-2
              border
              border-red-700
              rounded
              inline-block
              mr-6"
            >
              <FontAwesomeIcon id="removeTradeList" className="m-1 trash-alt-icon cursor-pointer" icon={['fas', 'trash-alt']} />
            </button>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  return (
    <Layout>
      <SEO title="Wishlist" img={'/android-chrome-512x512.png'} />
      <h1 className="text-3xl font-bold">Wishlist</h1>
      <div className="m-auto lg:w-9/12 md:w-full">
        {errorPlaceholder()}
        {loadingPlaceholder()}
        {imgPlaceholder()}
        {wishlistSettings()}

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 mr-2">
            <button
              onClick={genWishlist}
              className={`w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 disabled:bg-gray-600 ${
                (wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)) && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)}
            >
              Generate
            </button>
          </div>
          {!wishlist.items.length && !wishlist.tradeItems.length && (
            <b className={'text-lg mt-2'}>Add caps to your wishlist or tradelist to generate a wishlist</b>
          )}
          <div className="w-full md:w-1/4 mr-2">
            {b64Img ? (
              <a
                href={`data:image/png;base64,${b64Img}`}
                download="wishlist.png"
                className={`
                  block
                  w-full
                  bg-green-500
                  hover:bg-green-700
                  text-white
                  font-bold
                  py-2
                  px-4
                  rounded
                  text-center
                  ${wishlistLoading && 'cursor-not-allowed opacity-50'}
                `}
                disabled={wishlistLoading}
              >
                Download Wishlist
              </a>
            ) : (
              ''
            )}
          </div>
        </div>
        {wishlist.tradeItems.length ? (
          <div className="mb-4">
            <div className="flex flex-wrap mt-2">
              <div className="w-1/2 pr-2">
                <label
                  className="block text-gray-700 border-gray-100
                text-sm font-bold
                mb-2"
                  htmlFor="haveText"
                >
                  {wishlist.settings.tradeTitle.text || 'Have'}
                </label>
                {tradelistPlaceHolder()}
              </div>
              <div className="w-1/2 pr-2">
                <label
                  className="block text-gray-700 border-gray-100
                text-sm font-bold
                mb-2"
                  htmlFor="wantText"
                >
                  {wishlist.settings.title.text || 'Want'}
                </label>
                {wishlistPlaceHolder()}
              </div>
            </div>
          </div>
        ) : (
          wishlistPlaceHolder()
        )}
      </div>
      {showWishlistDeleteModal && (
        <ConfirmDialogModal
          modalHeader="Delete Active Wishlist?"
          placeholder={`Are you sure that you want to delete the '${wishlist.settings.title.text}' wishlist?`}
          setModal={setShowWishlistDeleteModal}
          onModalConfirm={() => deleteActiveWishlist()}
        />
      )}
    </Layout>
  );
};

export default Wishlist;
