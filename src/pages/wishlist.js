import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import SEO from '../components/seo';
import { cssColors } from '../internal/misc';
import Layout from '../components/layout';
import { getWishlist, setWishlist, rmCap, rmTradeCap } from '../internal/wishlist';

const baseAPIurl = 'https://app.keycap-archivist.com/api/v2/wishlist';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlist, setStateWishlist] = useState({
    settings: {
      capsPerLine: 3,
      priority: {},
      legends: {},
      title: {},
      tradeTitle: {},
      extraText: {},
      background: {},
      social: {},
    },
    items: [],
    tradeItems: [],
  });

  // Required for SSR
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);

  // TODO: add wonderfull animation
  const loadingPlaceholder = () => (wishlistLoading ? <div className="text-center">Currently loading</div> : '');

  // TODO: add sad face :(
  const errorPlaceholder = () => (errorLoading ? <div className="text-center">Something terrible happpened</div> : '');

  // prettier and eslint are dunmb on this somehow
  // eslint-disable-next-line no-confusing-arrow
  const imgPlaceholder = () =>
    b64Img && !wishlistLoading ? <img src={`data:image/png;base64,${b64Img}`} className="mx-auto max-w-full" /> : '';

  const genWishlist = async () => {
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

    const b64 = await axios
      .post(`${baseAPIurl}`, outWishlist, {
        responseType: 'arraybuffer',
      })
      .then((response) => Buffer.from(response.data, 'binary').toString('base64'))
      .catch((e) => {
        console.log(e);
        setErrorLoading(true);
      });
    setWishlistLoading(false);
    setB64Img(b64);
  };

  const setPriority = (id, priority) => {
    const idx = wishlist.items.findIndex((x) => x.id === id);
    wishlist.items[idx].prio = priority;
    setWishlist(wishlist);
    setStateWishlist({ ...wishlist });
  };

  const setSettingWishlist = (property, key, e) => {
    if (property === 'capsPerLine') {
      wishlist.settings.capsPerLine = e.target.value;
    } else {
      wishlist.settings[property][key] = e.target.value;
    }
    setWishlist(wishlist);
    setStateWishlist({ ...wishlist });
  };

  const wishlistSettings = () => (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capsPerLine">
              Number of Keycaps Per Line
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priorityColor">
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priorityFont">
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
              {['RedRock', 'Roboto'].map((x) => (
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="legendsFont">
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
              {['RedRock', 'Roboto'].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="legendsColor">
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="backgroundColor">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tradeTitleColor">
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
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tradeTitleFont">
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
                {['RedRock', 'Roboto'].map((x) => (
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titleText">
              Title
            </label>
            <input
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="titleText"
              type="text"
              value={wishlist.settings.title.text}
              onChange={(e) => setSettingWishlist('title', 'text', e)}
              placeholder={wishlist.tradeItems.length ? 'Want' : 'Wishlist'}
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titleColor">
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titleFont">
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
              {['RedRock', 'Roboto'].map((x) => (
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
            <label className="block text-gray-700 border-gray-100 text-sm font-bold mb-2" htmlFor="extraText">
              Extra Text
            </label>
            <input
              className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="extraText"
              type="text"
              value={wishlist.settings.extraText.text}
              onChange={(e) => setSettingWishlist('extraText', 'text', e)}
              placeholder="Willing to topup if needed"
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="extraColor">
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="extraFont">
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
              {['RedRock', 'Roboto'].map((x) => (
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
            <label className="block text-gray-700 border-gray-100 text-sm font-bold mb-2" htmlFor="socialReddit">
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
              placeholder="r/username"
            />
          </div>
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700 border-gray-100 text-sm font-bold mb-2" htmlFor="socialDiscord">
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
          const w = { ...wishlist };
          w.items = e;
          setStateWishlist(w);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlist(wishlist);
        }}
      >
        {wishlist.items.map((x) => (
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="cursor-move handle inline-block text-3xl mr-6" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`${baseAPIurl}/img/${x.id}`}
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
                Remove Priority
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
                Add Priority
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
              X
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
          const w = { ...wishlist };
          w.tradeItems = e;
          setStateWishlist(w);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlist(wishlist);
        }}
      >
        {wishlist.tradeItems.map((x) => (
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="cursor-move handle inline-block text-3xl mr-6" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`${baseAPIurl}/img/${x.id}`}
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
              X
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
      <div className="m-auto lg:w-8/12 md:w-full">
        {errorPlaceholder()}
        {loadingPlaceholder()}
        {imgPlaceholder()}
        {wishlistSettings()}

        <div className="flex flex-wrap">
          <div className="w-full md:w-1/4 mr-2">
            <button
              onClick={genWishlist}
              className={`w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                wishlistLoading && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading}
            >
              Generate
            </button>
          </div>
          <div className="w-full md:w-1/4 mr-2">
            {b64Img ? (
              <button
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
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
        {wishlist.tradeItems.length ? (
          <>
            <div className="my-4">
              <label
                className="block text-gray-700 border-gray-100
                text-sm font-bold
                mb-2"
                htmlFor="haveText"
              >
                Have
              </label>
              {tradelistPlaceHolder()}
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 border-gray-100
                text-sm font-bold
                mb-2"
                htmlFor="wantText"
              >
                Want
              </label>
              {wishlistPlaceHolder()}
            </div>
          </>
        ) : (
          wishlistPlaceHolder()
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
