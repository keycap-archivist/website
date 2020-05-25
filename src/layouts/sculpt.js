/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getWishlist, isInWishlist } from '../internal/wishlist';

// import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { maker, makerUrl, sculpt } = pageContext;

  const seoTitle = `${maker.name} - ${sculpt.name}`;

  const [wishlist, setStateWishlist] = useState(undefined);
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);

  return (
    <Layout>
      <SEO title={seoTitle} img={sculpt.previewImg} />
      <div className="pt-4">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
        <span className="text-gray-400"> / </span>
        <Link to={makerUrl} className="text-blue-600">
          {maker.name}
        </Link>
      </div>
      <h2 className="text-3xl my-6">
        <span className="font-bold">{sculpt.name}</span>
      </h2>
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {sculpt.colorways.map((c) => (
          <li key={c.id} id={c.id} className="flex h-auto w-1/2 md:w-1/4 lg:w-1/5 py-1 px-1">
            <Link
              to={`${location.pathname}/${c.id}`}
              className="
                flex
                flex-col
                justify-between
                max-w-full
                min-w-full
                bg-white
                p-2
                bg-white
                hover:text-blue-600
                shadow-xs
                hover:shadow-md
                pb-4"
            >
              <div className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <img className="h-full w-full object-cover" src={c.img} />
              </div>
              <div className="font-bold pt-3 px-2 text-center">
                <div className="text-sm">{c.name ? c.name : '(Unknown)'}</div>
                {isInWishlist(wishlist, c.id) ? 'IN' : '!IN'}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
