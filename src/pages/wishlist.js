import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import SEO from '../components/seo';
import { cssColors } from '../internal/misc';
import Layout from '../layouts/base';
import { getLocalCollections, setWishlist, defaultSettings } from '../internal/wishlist';
import { getConfig } from '../internal/config';
import { getCollections, updateCollection } from '../internal/collection';

const baseAPIurl = 'https://api.keycap-archivist.com/wishlist';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [wishlist, setStateWishlist] = useState({
    items: [],
  });
  const [tradelist, setStateTradeList] = useState({
    items: [],
  });
  const [wishlistId, setWishlistId] = useState(null);
  const [tradelistId, setTradelistId] = useState(null);
  const [fonts] = useState(['BebasNeue', 'PermanentMarker', 'Roboto', 'RedRock']);

  const [collections, setCollections] = useState([]);
  const [wtt, setWTT] = useState(false);

  const cfg = getConfig();
  // Required for SSR
  useEffect(async () => {
    const list = cfg.authorized ? await getCollections() : getLocalCollections();

    setCollections(list);
    setStateWishlist(list[0].content);
    setStateTradeList(list[0].content);
  }, []);

  // TODO: add wonderfull animation
  const loadingPlaceholder = () => (wishlistLoading ? <div className="text-center">Currently loading</div> : '');

  // TODO: add sad face :(
  const errorPlaceholder = () => (errorLoading ? <div className="text-center">Something terrible happpened</div> : '');

  // prettier and eslint are dumb on this somehow
  // eslint-disable-next-line no-confusing-arrow
  const imgPlaceholder = () => (b64Img && !wishlistLoading ? <img src={`data:image/png;base64,${b64Img}`} className="mx-auto max-w-full" /> : '');

  const genWishlist = async () => {
    setErrorLoading(false);
    setWishlistLoading(true);

    const outWishlist = { settings: wishlist.settings };
    outWishlist.capsPerLine = parseInt(outWishlist.capsPerLine, 10);
    outWishlist.tradeCaps = (wtt ? tradelist.items : []).map((i) => ({
      id: i.id,
      legendColor: wishlist.settings.tradeTitle.color,
    }));
    outWishlist.caps = wishlist.items.map((i) => ({
      id: i.id,
      isPriority: i.prio,
      legendColor: wishlist.settings.title.color,
    }));

    const r = await axios
      .post(`${baseAPIurl}/generate`, outWishlist)
      .then((d) => d.data)
      .catch((e) => {
        console.log(e);
        setErrorLoading(true);
      });
    console.log(r);
    setWishlistLoading(false);
    setB64Img(r.Body);
  };

  const setPriority = (id, priority) => {
    const idx = wishlist.items.findIndex((x) => x.id === id);
    wishlist.items[idx].prio = priority;
    setWishlist(wishlist, wishlistId);
    setStateWishlist({ ...wishlist });
  };

  const setSettingWishlist = (property, key, e) => {
    if (property === 'capsPerLine') {
      settings.capsPerLine = e.target.value;
    } else {
      settings[property][key] = e.target.value;
    }

    setSettings(settings);
  };

  const wishlistSettings = () => (
    <>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="capsPerLine">
              No. Keycaps Per Line
            </label>
            <input
              id="capsPerLine"
              value={settings.capsPerLine}
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
              value={settings.priority.color}
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
              value={settings.priority.font}
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
              value={settings.legends.font}
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
              value={settings.legends.color}
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
              value={settings.background.color}
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
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <label className="wishlist_form" htmlFor="wantToTrade">
            <span>Want to trade</span>
            <div className="relative">
              <input
                name="wantToTrade"
                id="wantToTrade"
                type="checkbox"
                className="sr-only"
                checked={wtt === true}
                onChange={() => {
                  setWTT(!wtt);
                }}
              />{' '}
              <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
            </div>
          </label>
        </div>
      </div>

      {wtt ? (
        <div className="mb-4">
          <div className="flex flex-wrap mt-2">
            <div className="w-1/4 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleText">
                Trade Text
              </label>
              <input
                className="shadow appearance-none border
              rounded border-gray-100
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
                id="tradeTitleText"
                type="text"
                value={settings.tradeTitle.text}
                onChange={(e) => setSettingWishlist('tradeTitle', 'text', e)}
                placeholder="Have"
              />
            </div>
            <div className="w-1/4 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleText">
                Trade Collection
              </label>
              <select
                className="shadow appearance-none
                border border-gray-100 rounded w-full
                 py-2 px-3 text-gray-700 leading-tight
                 focus:outline-none focus:shadow-outline"
                type="select"
                onChange={(e) => {
                  const collection = collections.find((c) => c.id === e.target.value);
                  setStateTradeList(collection.content);
                  setTradelistId(collection.id);
                }}
              >
                {collections.map((collection) => (
                  <option value={collection.id} key={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleColor">
                Trade Title Color
              </label>
              <select
                id="tradeTitleColor"
                className="shadow appearance-none border border-gray-100
                rounded w-full py-2 px-3 text-gray-700 leading-tight
                focus:outline-none focus:shadow-outline"
                type="select"
                value={settings.tradeTitle.color}
                onChange={(e) => setSettingWishlist('tradeTitle', 'color', e)}
              >
                {cssColors.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4 pr-2">
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
                value={settings.tradeTitle.font}
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
          <div className="w-1/4 pr-2">
            <label className="wishlist_form" htmlFor="titleText">
              Title
            </label>
            <input
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              id="titleText"
              type="text"
              value={settings.title.text}
              onChange={(e) => setSettingWishlist('title', 'text', e)}
              placeholder={wtt ? 'Want' : 'Wishlist'}
            />
          </div>
          <div className="w-1/4 pr-2">
            <label className="wishlist_form" htmlFor="tradeTitleText">
              Wish Collection
            </label>
            <select
              className="shadow appearance-none
                border border-gray-100 rounded w-full
                 py-2 px-3 text-gray-700 leading-tight
                 focus:outline-none focus:shadow-outline"
              type="select"
              onChange={(e) => {
                const collection = collections.find((c) => c.id === e.target.value);
                setStateWishlist(collection.content);
                setWishlistId(collection.id);
              }}
            >
              {collections.map((collection) => (
                <option value={collection.id} key={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4 pr-2">
            <label className="wishlist_form" htmlFor="titleColor">
              Title Color
            </label>
            <select
              id="titleColor"
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              type="select"
              value={settings.title.color}
              onChange={(e) => setSettingWishlist('title', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/4 pr-2">
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
              value={settings.title.font}
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
              value={settings.extraText.text}
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
              value={settings.extraText.color}
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
              value={settings.extraText.font}
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
              value={settings.social.reddit}
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
              value={settings.social.discord}
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
          // write the wishlist onEnd only
          if (cfg.authorized) {
            updateCollection(wishlistId, {
              wishlist,
            });
          } else {
            setWishlist(wishlist, wishlistId);
          }
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
              onClick={() => {
                wishlist.items = wishlist.items.filter((c) => c.id !== x.id);
                setStateWishlist(wishlist);
              }}
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
        list={tradelist ? tradelist.items : []}
        setList={(e) => {
          // Update the state of the component only
          const w = { ...tradelist };
          w.items = e;
          setStateTradeList(w);
        }}
        onEnd={() => {
          // write the tradelist onEnd only
          if (cfg.authorized) {
            updateCollection(tradelistId, {
              wishlist: tradelist,
            });
          } else {
            setWishlist(tradelist, tradelistId);
          }
        }}
      >
        {tradelist.items.map((x) => (
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="cursor-move handle inline-block text-3xl mr-6" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`}
              className="cursor-move handle inline-block rounded-lg max-h-full mr-6"
            />
            <span></span>
            <button
              onClick={() => {
                tradelist.items = tradelist.items.filter((c) => c.id !== x.id);
                setStateTradeList(tradelist);
              }}
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
              className={`w-full  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 ${
                // eslint-disable-next-line prettier/prettier
                (wishlistLoading || (!wishlist.items.length && !tradelist.items.length))
                // eslint-disable-next-line prettier/prettier
                && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading || (!wishlist.items.length && !tradelist.items.length)}
            >
              Generate
            </button>
          </div>
          {!wishlist.items.length && !tradelist.items.length && <b className={'text-lg mt-2'}>Add caps to your wishlist or tradelist to generate a wishlist</b>}
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
        {wtt ? (
          <div className="mb-4">
            <div className="flex flex-wrap mt-2">
              <div className="w-1/2 pr-2">
                <label className="wishlist_form" htmlFor="haveText">
                  {settings.tradeTitle.text || 'Have'}
                </label>
                {tradelistPlaceHolder()}
              </div>
              <div className="w-1/2 pr-2">
                <label className="wishlist_form" htmlFor="wantText">
                  {settings.title.text || 'Want'}
                </label>
                {wishlistPlaceHolder()}
              </div>
            </div>
          </div>
        ) : (
          wishlistPlaceHolder()
        )}
      </div>
    </Layout>
  );
};

export default Wishlist;
