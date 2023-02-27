/* eslint-disable no-return-assign */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import { sortBy } from 'lodash';
import React, { useEffect, useState } from 'react';

import Alert from '../components/alert';
import SubmitNewCwModal from '../components/modals/submit-new-cw';
import SEO from '../components/seo';
import ThumbnailImage from '../components/thumbnail-image';
import {
  addCap,
  addTradeCap,
  getDefaultWishlistContainer,
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
  const { maker, makerUrl, sculpt, selfOrder } = pageContext;

  const seoTitle = `${maker.name} - ${sculpt.name}`;

  const [wishlistContainer, setStateWishlist] = useState(getDefaultWishlistContainer());
  useEffect(() => {
    setStateWishlist(getWishlistContainer());
  }, []);
  const wishlist = wishlistContainer.wishlists.find((x) => x.id === wishlistContainer.activeWishlistId);
  const cwList = selfOrder === true ? sculpt.colorways : sortBy(sculpt.colorways, (x) => x.name);
  const [showModal, setShowModal] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showExceedAlert, setShowExceedAlert] = useState(false);
  return (
    <Layout>
      {showSuccessAlert && <Alert color="green" alertMessage="Colorway Successfully Submitted" setAlert={setShowSuccessAlert} />}
      {showErrorAlert && <Alert color="red" alertMessage="Colorway Submission Failed" setAlert={setShowErrorAlert} />}
      {showExceedAlert && <Alert color="red" alertMessage="Wishlist or trade list items exceeded" setAlert={setShowExceedAlert} />}
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
      <div className="flex flex-col sm:flex-row justify-between my-6">
        <div className="mb-2 pr-3 leading-snug sm:mb-0">
          <h2 className="text-3xl font-bold leading-none">{sculpt.name}</h2>
          {sculpt.releaseDate ? (
            <div className="mt-2">
              <FontAwesomeIcon icon={['fa', 'calendar']} />
              <span className="font-bold mx-2">Release date:</span>
              {sculpt.releaseDate}
            </div>
          ) : (
            ''
          )}
          {sculpt.profile && (
            <div className="mt-2">
              <FontAwesomeIcon icon={['fa', 'keyboard']} />
              <span className="font-bold mx-2">Profile :</span>
              {sculpt.profile}
            </div>
          )}
          {sculpt.design && (
            <div className="mt-2">
              <FontAwesomeIcon icon={['fa', 'brain']} />
              <span className="font-bold mx-2">Design :</span>
              {sculpt.design}
            </div>
          )}
          {sculpt.cast && (
            <div className="mt-2">
              <FontAwesomeIcon icon={['fa', 'palette']} />
              <span className="font-bold mx-2">Cast :</span>
              {sculpt.cast}
            </div>
          )}
        </div>

        {/* <div className="flex flex-row flex-no-wrap flex-shrink-0 mt-1 items-start">
          {maker.denySubmission !== true && (
            <button
              className="
              inline-block
              block
              w-35
              bg-teal-500
              hover:bg-teal-700
              text-white
              font-bold
              py-1
              px-2
              text-xs
              rounded"
              onClick={() => setShowModal(true)}
            >
              Submit a Colorway
            </button>
          )}
          </div> */}
      </div>

      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {cwList.map((c) => (
          <li key={c.id} id={c.id} className="tile_item">
            <div className="tile_sculpt">
              <Link to={`${location.pathname}/${c.id}`} className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <ThumbnailImage
                  loading="lazy"
                  className="h-full w-full object-cover"
                  src={`https://cdn.keycap-archivist.com/keycaps/250/${c.id}.jpg`}
                  alt={`${maker.name} - ${sculpt.name} - ${c.name}`}
                />
              </Link>
              <div className="font-bold flex flex-row pt-3 px-2 relative">
                {isInWishlist(wishlist, c.id) ? (
                  <FontAwesomeIcon
                    id="favStar"
                    title={`Remove from '${wishlist.settings.title.text}' list`}
                    className="m-1 star-icon text-yellow-500 cursor-pointer"
                    icon={['fas', 'star']}
                    onClick={() => setStateWishlist(rmCap(c.id))}
                  />
                ) : (
                  <FontAwesomeIcon
                    id="favStar"
                    title={`Add to '${wishlist.settings.title.text}' list`}
                    className="m-1 star-icon text-gray-500 cursor-pointer"
                    icon={['fas', 'star']}
                    onClick={() => {
                      if (isInTradeList(wishlist, c.id)) {
                        rmTradeCap(c.id);
                      }
                      if (wishlist.items.length >= WishlistLimit) {
                        setShowExceedAlert(true);
                      } else {
                        setStateWishlist(addCap(c.id));
                      }
                    }}
                  />
                )}
                {isInTradeList(wishlist, c.id) ? (
                  <FontAwesomeIcon
                    id="favTrade"
                    title={`Remove from '${wishlist.settings.title.text}' trade list`}
                    className="m-1 redo-icon text-yellow-500 cursor-pointer"
                    icon={['fas', 'redo']}
                    onClick={() => setStateWishlist(rmTradeCap(c.id))}
                  />
                ) : (
                  <FontAwesomeIcon
                    id="favTrade"
                    title={`Add to '${wishlist.settings.title.text}' trade list${isInWishlist(wishlist, c.id) ? ' (and remove from wishlist)' : ''}`}
                    className="m-1 redo-icon text-gray-500 cursor-pointer"
                    icon={['fas', 'redo']}
                    onClick={() => {
                      if (isInWishlist(wishlist, c.id)) {
                        rmCap(c.id);
                      }
                      if (wishlist.tradeItems.length >= TradeListLimit) {
                        setShowExceedAlert(true);
                      } else {
                        setStateWishlist(addTradeCap(c.id));
                      }
                    }}
                  />
                )}
                <Link to={`${location.pathname}/${c.id}`} className="text-sm text-center w-full px-5">
                  {c.name ? c.name : '(Unknown)'}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {showModal && (
        <SubmitNewCwModal
          setModal={setShowModal}
          maker={maker.name}
          sculpt={sculpt.name}
          setErrorAlert={setShowErrorAlert}
          setSuccessAlert={setShowSuccessAlert}
        />
      )}
    </Layout>
  );
};

export default Maker;
