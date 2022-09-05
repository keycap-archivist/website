/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getWishlist, isInWishlist, rmCap, addCap, isInTradeList, rmTradeCap, addTradeCap, WishlistLimit, TradeListLimit } from '../internal/wishlist';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import Alert from '../components/alert';
import SubmitNameModal from '../components/modals/submit-name';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${colorway.name} ${sculptName}`;
  const [state, setState] = useState({ text: 'Copy link' });

  const [showModal, setShowModal] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showExceedAlert, setShowExceedAlert] = useState(false);

  const updateText = () => {
    setState({ text: 'Copied!' });
  };

  const [wishlist, setStateWishlist] = useState(undefined);
  useEffect(() => {
    setStateWishlist(getWishlist());
  }, []);
  const cwImg = `https://cdn.keycap-archivist.com/keycaps/720/${colorway.id}.jpg`;
  return (
    <Layout>
      {showSuccessAlert && <Alert color="green" alertMessage="Suggestion Successfully Submited" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Suggestion Submission Failed" setAlert={setShowErrorAlert} />}
      {showExceedAlert && <Alert color="red" alertMessage="Wishlist or trade list items exceeded" setAlert={setShowExceedAlert} />}
      <SEO title={seoTitle} img={cwImg} />
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
          <div className="mb-2 pr-3 leading-snug sm:mb-0">
            <h2 className="text-3xl font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</h2>
            {colorway.releaseDate ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'calendar']} />
                <span className="font-bold mx-2">Release date:</span>
                {colorway.releaseDate}
              </div>
            ) : (
              ''
            )}
            {colorway.totalCount ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'calculator']} />
                <span className="font-bold mx-2">Total Count:</span>
                {colorway.totalCount}
              </div>
            ) : (
              ''
            )}
            {colorway.commissioned ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'palette']} />
                <span className="font-bold mx-2">Commissioned</span>
              </div>
            ) : (
              ''
            )}
            {colorway.giveaway ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'gift']} />
                <span className="font-bold mx-2">Giveaway</span>
              </div>
            ) : (
              ''
            )}
          </div>
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
                rounded
                whitespace-no-wrap"
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
                onClick={() => {
                  if (isInTradeList(wishlist, colorway.id)) {
                    rmTradeCap(colorway.id);
                  }
                  if (wishlist.items.length >= WishlistLimit) {
                    setShowExceedAlert(true);
                  } else {
                    setStateWishlist(addCap(colorway.id));
                  }
                }}
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
            {isInTradeList(wishlist, colorway.id) ? (
              <button
                onClick={() => setStateWishlist(rmTradeCap(colorway.id))}
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
                <FontAwesomeIcon className="mr-1" icon={['fas', 'redo']} />
                <span>Remove from trade list</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isInWishlist(wishlist, colorway.id)) {
                    rmCap(colorway.id);
                  }
                  if (wishlist.tradeItems.length >= TradeListLimit) {
                    setShowExceedAlert(true);
                  } else {
                    setStateWishlist(addTradeCap(colorway.id));
                  }
                }}
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
                <FontAwesomeIcon className="mr-1" icon={['fas', 'redo']} />
                <span>Add to trade list</span>
              </button>
            )}
          </div>
        </div>
        <div className="colorway-wrapper">
          <div className="flex flex-col p-5 mx-auto">
            <div className="colorway-wrapper">
              <img loading="lazy" className="block h-full w-full object-cover" alt={seoTitle} src={cwImg} />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <SubmitNameModal
          modalHeader="Suggest Colorway Name"
          placeholder="Suggestion Name"
          clwId={colorway.id}
          setModal={setShowModal}
          setErrorAlert={setShowErrorAlert}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
    </Layout>
  );
};

export default Maker;
