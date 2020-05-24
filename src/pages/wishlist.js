import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import SEO from '../components/seo';

import { getWishlist, setWishlist, rmCap, resetWishlist } from '../internal/wishlist';

const baseAPIurl = 'https://app.keycap-archivist.com/api/v1';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [wishlist, setStateWishlist] = useState(getWishlist());

  const imgPlaceholder = () => {
    if (b64Img) {
      return <img style={{ maxWidth: '500px' }} src={`data:image/jpeg;base64,${b64Img}`} />;
    }
    return '';
  };

  const genWishlist = async () => {
    const outWishlist = {};
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
    return { ...wishlist };
  };

  const wishlistPlaceHolder = () => (
    <ul>
      <button
        className="bg-green-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
        onClick={() => setStateWishlist(resetWishlist())}
      >
        Reset DEV
      </button>
      {wishlist.items.map((x) => (
        <li key={x.id}>
          {x.id}
          <img style={{ maxWidth: '200px' }} src={`${baseAPIurl}/img/${x.id}`} />
          {x.prio ? (
            <button
              onClick={() => setStateWishlist(setPriority(x.id, false))}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 border border-red-700 rounded"
            >
              remove Priority
            </button>
          ) : (
            <button
              onClick={() => setStateWishlist(setPriority(x.id, true))}
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
    </ul>
  );

  return (
    <Layout>
      <SEO title="Wishlist" img={'/android-chrome-512x512.png'} />
      <h1>Wishlist</h1>
      {imgPlaceholder()}
      <button onClick={genWishlist} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        test
      </button>
      <p>diz iz da wishlist</p>
      {wishlistPlaceHolder()}
    </Layout>
  );
};

export default Wishlist;
