/* eslint-disable no-return-assign */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Alert from '../components/alert';
import SubmitNameModal from '../components/modals/submit-name';
import SEO from '../components/seo';
import {
  addCap,
  addTradeCap,
  defaultWishlistContainer,
  getWishlistContainer,
  isInTradeList,
  isInWishlist,
  rmCap,
  rmTradeCap,
  TradeListLimit,
  WishlistLimit,
} from '../internal/wishlist';
import Layout from '../layouts/base';

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

  const [wishlistContainer, setStateWishlist] = useState(defaultWishlistContainer);
  useEffect(() => {
    setStateWishlist(getWishlistContainer());
  }, []);
  const wishlist = wishlistContainer.wishlists.find((x) => x.id === wishlistContainer.activeWishlistId);
  const cwImg = `https://cdn.keycap-archivist.com/keycaps/720/${colorway.id}.jpg`;
  return (
    <Layout>
      {showSuccessAlert && <Alert color="green" alertMessage="Suggestion Successfully Submited" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Suggestion Submission Failed" setAlert={setShowErrorAlert} />}
      {showExceedAlert && <Alert color="red" alertMessage="Wishlist or trade list items exceeded" setAlert={setShowExceedAlert} />}
      <SEO title={seoTitle} img={cwImg} />
      <div className="mx-auto lg:w-3/5">
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
        <div className="my-6 flex flex-col justify-between sm:flex-row">
          <div className="mb-2 pr-3 leading-snug sm:mb-0">
            <h2 className="text-3xl font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</h2>
            {colorway.releaseDate ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'calendar']} />
                <span className="mx-2 font-bold">Release date:</span>
                {colorway.releaseDate}
              </div>
            ) : (
              ''
            )}
            {colorway.totalCount ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'calculator']} />
                <span className="mx-2 font-bold">Total Count:</span>
                {colorway.totalCount}
              </div>
            ) : (
              ''
            )}
            {colorway.commissioned ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'palette']} />
                <span className="mx-2 font-bold">Commissioned</span>
              </div>
            ) : (
              ''
            )}
            {colorway.giveaway ? (
              <div className="mt-2">
                <FontAwesomeIcon icon={['fa', 'gift']} />
                <span className="mx-2 font-bold">Giveaway</span>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="flex-no-wrap mt-1 flex shrink-0 flex-row items-start">
            {!colorway.name && (
              <button
                className="
                  modal-open
                  w-35
                  mx-2
                  ml-2
                  block
                  rounded
                  bg-pink-500
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-pink-700"
                onClick={() => setShowModal(true)}
              >
                Suggest Name
              </button>
            )}
            <CopyToClipboard text={location.href} onCopy={updateText}>
              <button
                className="
                whitespace-no-wrap
                block
                w-20
                rounded
                bg-blue-500
                px-3
                py-2 text-xs
                font-bold
                text-white
                hover:bg-blue-700"
              >
                {state.text}
              </button>
            </CopyToClipboard>
            {isInWishlist(wishlist, colorway.id) ? (
              <button
                onClick={() => setStateWishlist(rmCap(colorway.id))}
                className="
                  ml-2
                  block
                  inline-flex
                  w-48
                  items-center
                  justify-center
                  rounded
                  bg-red-500
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-red-700"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Remove from &quot;{wishlist.settings.title.text}&quot; wishlist</span>
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
                  ml-2
                  block
                  w-48
                  rounded
                  bg-green-500
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-green-700"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'star']} />
                <span>Add to &quot;{wishlist.settings.title.text}&quot; wishlist</span>
              </button>
            )}
            {isInTradeList(wishlist, colorway.id) ? (
              <button
                onClick={() => setStateWishlist(rmTradeCap(colorway.id))}
                className="
                  ml-2
                  block
                  inline-flex
                  w-48
                  items-center
                  justify-center
                  rounded
                  bg-red-500
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-red-700"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'redo']} />
                <span>Remove from &quot;{wishlist.settings.title.text}&quot; trade list</span>
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
                  ml-2
                  block
                  w-48
                  rounded
                  bg-green-500
                  px-3
                  py-2
                  text-xs
                  font-bold
                  text-white
                  hover:bg-green-700"
              >
                <FontAwesomeIcon className="mr-1" icon={['fas', 'redo']} />
                <span>Add to &quot;{wishlist.settings.title.text}&quot; trade list</span>
              </button>
            )}
          </div>
        </div>
        <div className="colorway-wrapper">
          <div className="mx-auto flex flex-col p-5">
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
