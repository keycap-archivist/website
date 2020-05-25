import React, { useState, useEffect } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import SEO from '../components/seo';
import { cssColors } from '../internal/misc';
import Layout from '../components/layout';
import { getWishlist, setWishlist, rmCap } from '../internal/wishlist';

const baseAPIurl = 'https://app.keycap-archivist.com/api/v1';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [wishlist, setStateWishlist] = useState({ settings: {}, items: [] });

  // Required for SSR
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);

  const imgPlaceholder = () => {
    if (b64Img) {
      return (
        <>
          <img style={{ maxWidth: '500px' }} src={`data:image/jpeg;base64,${b64Img}`} />
          <a href={`data:image/jpeg;base64,${b64Img}`} download="wishlist.jpg">
            download Wishlist
          </a>
        </>
      );
    }
    return '';
  };

  const genWishlist = async () => {
    const outWishlist = { ...wishlist.settings };
    outWishlist.capsPerLine = parseInt(outWishlist.capsPerLine, 10);
    outWishlist.ids = wishlist.items.map((x) => x.id);
    outWishlist.priorities = wishlist.items.filter((x) => x.prio).map((x) => x.id);
    const b64 = await axios
      .post(`${baseAPIurl}`, outWishlist, {
        responseType: 'arraybuffer',
      })
      .then((response) => Buffer.from(response.data, 'binary').toString('base64'));
    setB64Img(b64);
  };

  const setPriority = (id, priority) => {
    const idx = wishlist.items.findIndex((x) => x.id === id);
    wishlist.items[idx].prio = priority;
    setWishlist(wishlist);
    setStateWishlist({ ...wishlist });
  };

  const setSettingWishlist = (property, e) => {
    wishlist.settings[property] = e.target.value;
    setWishlist(wishlist);
    setStateWishlist({ ...wishlist });
  };

  const wishlistSettings = () => (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="wishlistname">
          Wishlist Title
        </label>
        <input
          className="shadow
          appearance-none border
          border-gray-100 rounded
          w-full py-2 px-3 text-gray-700
          leading-tight focus:outline-none
          focus:shadow-outline"
          id="wishlistname"
          type="text"
          value={wishlist.settings.titleText}
          onChange={(e) => setSettingWishlist('titleText', e)}
          placeholder="Wishlist"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 border-gray-100
          text-sm font-bold
          mb-2"
          htmlFor="extraText"
        >
          Extra text
        </label>
        <input
          className="shadow appearance-none border
          rounded border-gray-100
          w-full py-2 px-3 text-gray-700 leading-tight
          focus:outline-none focus:shadow-outline"
          id="extraText"
          type="text"
          value={wishlist.settings.extraText}
          onChange={(e) => setSettingWishlist('extraText', e)}
          placeholder="Contact me u/foobar"
        />
      </div>
      <div className="mb-4">
        <div className="flex flex-wrap mt-2">
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capsPerLine">
              Number keycap per line
            </label>
            <input
              id="capsPerLine"
              value={wishlist.settings.capsPerLine}
              onChange={(e) => setSettingWishlist('capsPerLine', e)}
              className="shadow appearance-none border border-gray-100 rounded
              w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              type="number"
            />
          </div>
          <div className="w-1/2 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textColor">
              Title Police
            </label>
            <select
              id="titlePolice"
              className="shadow appearance-none
              border border-gray-100 rounded w-full
               py-2 px-3 text-gray-700 leading-tight
               focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.titlePolice}
              onChange={(e) => setSettingWishlist('titlePolice', e)}
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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titleColor">
              Title Color
            </label>
            <select
              id="titleColor"
              className="shadow appearance-none border border-gray-100
              rounded w-full py-2 px-3 text-gray-700 leading-tight
              focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.titleColor}
              onChange={(e) => setSettingWishlist('titleColor', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="textColor">
              Text Color
            </label>
            <select
              id="textColor"
              className="shadow
              appearance-none
              border
              border-gray-100
              rounded w-full py-2
              px-3 text-gray-700 leading-tight
              focus:outline-none
              focus:shadow-outline"
              type="select"
              value={wishlist.settings.textColor}
              onChange={(e) => setSettingWishlist('textColor', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bgColor">
              Background Color
            </label>
            <select
              id="bgColor"
              className="shadow appearance-none border
              border-gray-100
              rounded w-full py-2 px-3 text-gray-700
              leading-tight
              focus:outline-none focus:shadow-outline"
              type="select"
              value={wishlist.settings.bg}
              onChange={(e) => setSettingWishlist('bg', e)}
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
    </div>
  );

  const wishlistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
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
          <li key={x.id}>
            <FontAwesomeIcon className="cursor-move handle" icon="align-justify" />
            <img style={{ maxWidth: '200px' }} src={`${baseAPIurl}/img/${x.id}`} />
            {x.prio ? (
              <button
                onClick={() => setPriority(x.id, false)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
              >
                remove Priority
              </button>
            ) : (
              <button
                onClick={() => setPriority(x.id, true)}
                className="bg-green-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
              >
                add Priority
              </button>
            )}
            <button
              onClick={() => setStateWishlist(rmCap(x.id))}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
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
      <h1>Wishlist</h1>
      {imgPlaceholder()}
      {wishlistSettings()}
      <button onClick={genWishlist} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Generate
      </button>
      {wishlistPlaceHolder()}
    </Layout>
  );
};

export default Wishlist;
