/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getWishlist, isInWishlist, rmCap, addCap } from '../internal/wishlist';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${colorway.name} ${sculptName}`;
  const [state, setState] = useState({ text: 'Copy link' });

  const [showModal, setShowModal] = useState(false);

  const updateText = () => {
    setState({ text: 'Copied!' });
  };

  const [wishlist, setStateWishlist] = useState(undefined);
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);

  const [suggestionName, setSuggestionName] = useState('');

  const submitName = (clwId, clwName) => {
    fetch('https://app.keycap-archivist.com/api/v2/submitName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: clwId, name: clwName }),
    }).catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Layout>
      <SEO title={seoTitle} img={colorway.img} />
      <div className="lg:w-3/5 mx-auto">
        <div className="pt-4">
          <Link to="/" className="text-blue-600">
            <FontAwesomeIcon icon={['fas', 'home']} />
          </Link>
          <span className="text-gray-400"> / </span>
          <Link to={makerUrl} className="text-blue-600">
            {makerName}
          </Link>
          <span className="text-gray-400"> / </span>
          <Link to={sculptUrl} className="text-blue-600">
            {sculptName}
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row justify-between my-6">
          <h2 className="text-3xl mb-2 pr-3 leading-snug sm:mb-0">
            <span className="font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</span>
          </h2>
          <div className="flex flex-row flex-no-wrap flex-shrink-0 mt-1 items-start">
            {!colorway.name && (
              <button
                className="
                  modal-open
                  mx-2
                  block
                  w-35
                  bg-pink-500
                  hover:bg-pink-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
                onClick={() => setShowModal(true)}
              >
                Suggest Name
              </button>
            )}
            <CopyToClipboard text={location.href} onCopy={updateText}>
              <button
                className="
                block
                w-20
                bg-blue-500
                hover:bg-blue-700
                text-white
                font-bold
                py-2 px-3
                text-xs
                rounded"
              >
                {state.text}
              </button>
            </CopyToClipboard>
            {isInWishlist(wishlist, colorway.id) ? (
              <button
                onClick={() => setStateWishlist(rmCap(colorway.id))}
                className="
                  block
                  w-48
                  inline-flex
                  items-center
                  justify-center
                  bg-red-500
                  hover:bg-red-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Remove from wishlist</span>
              </button>
            ) : (
              <button
                onClick={() => setStateWishlist(addCap(colorway.id))}
                className="
                  block
                  w-48
                  bg-green-500
                  hover:bg-green-700
                  text-white
                  font-bold
                  ml-2
                  py-2
                  px-3
                  text-xs
                  rounded"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Add to wishlist</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex bg-white">
          <div className="flex flex-col p-5 mx-auto">
            <div className="w-full h-full bg-gray-300">
              <img loading="lazy" className="block h-full w-full object-cover" alt={seoTitle} src={colorway.img} />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <>
          <div
            className="
            justify-center
            items-center
            flex
            overflow-x-hidden
            overflow-y-auto
            fixed
            inset-0
            z-50
            outline-none
            focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
                  <h3 className="text-2xl font-semibold">Suggest Colorway Name</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex content-around">
                  <input
                    className="suggest__input bg-purple-white shadow rounded border-0 p-2 w-full"
                    type="search"
                    placeholder="Name"
                    onChange={(event) => setSuggestionName(event.target.value)}
                  ></input>
                  <button
                    className="
                    mx-2
                    block
                    w-20
                    bg-green-500
                    hover:bg-green-700
                    text-white
                    font-bold
                    py-2 px-3
                    text-xs
                    rounded"
                    onClick={() => {
                      submitName(colorway.id, suggestionName);
                      setShowModal(false);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </Layout>
  );
};

export default Maker;
