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
import cn from '../internal/twMerge';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { maker, makerUrl, sculpt, selfOrder } = pageContext;

  const seoTitle = `${maker.name} - ${sculpt.name}`;

  const [wishlistContainer, setStateWishlist] = useState(defaultWishlistContainer);
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
      <div className="mt-6">
        {[
          {
            label: 'Home',
            link: '/',
          },
          {
            label: maker.name,
            link: makerUrl,
          },
        ].map((x) => (
          <>
            <Link
              to={x.link}
              className={cn(
                'text-sm font-medium text-slate-900/60 underline transition-colors',
                'hover:text-slate-800/60',
                'dark:text-slate-50/80',
                'dark:hover:text-white/90',
              )}
            >
              {x.label}
            </Link>{' '}
            /{' '}
          </>
        ))}
      </div>
      <div className="my-6 flex flex-col justify-between sm:flex-row">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">{sculpt.name}</h2>
          {sculpt.releaseDate && (
            <dl className="flex items-center pt-3">
              <FontAwesomeIcon className={'h-4 w-4 text-xl text-indigo-500'} icon={['fa', 'calendar']} />
              <dt className="mx-2 font-bold">Release date:</dt>
              <dd>{sculpt.releaseDate}</dd>
            </dl>
          )}

          {sculpt.profile && (
            <dl className="flex items-center">
              <FontAwesomeIcon className={'h-4 w-4 text-xl text-indigo-500'} icon={['fa', 'keyboard']} />
              <dt className="mx-2 font-bold">- Profile:</dt>
              <dd>{sculpt.profile}</dd>
            </dl>
          )}

          {sculpt.design && (
            <dl className="flex items-center">
              <FontAwesomeIcon className={'h-4 w-4 text-xl text-indigo-500'} icon={['fa', 'brain']} />
              <dt className="mx-2 font-bold">- Design:</dt>
              <dd>{sculpt.design}</dd>
            </dl>
          )}

          {sculpt.cast && (
            <dl className="flex items-center">
              <FontAwesomeIcon className={'h-4 w-4 text-xl text-indigo-500'} icon={['fa', 'palette']} />
              <dt className="mx-2 font-bold">- Cast:</dt>
              <dd>{sculpt.cast}</dd>
            </dl>
          )}
        </div>

        {/* <div className="flex flex-row flex-nowrap shrink-0 mt-1 items-start">
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

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {cwList.map((c) => (
          <li key={c.id} id={c.id} className="flex flex-col">
            <Link
              to={`${location.pathname}${c.id}`}
              className={cn(
                'block w-full overflow-hidden rounded-md bg-white shadow-md transition',
                'hover:border-slate-400/80 hover:shadow-lg',
                'dark:border dark:border-slate-600/50 dark:bg-slate-700 dark:text-slate-200 dark:shadow-none',
              )}
            >
              <div className="h-[250px] border-b border-slate-200 bg-white dark:border-b-2 dark:border-slate-600">
                <ThumbnailImage
                  className="h-full w-full object-cover"
                  src={`https://cdn.keycap-archivist.com/keycaps/250/${c.id}.jpg`}
                  alt={`${maker.name} - ${sculpt.name} - ${c.name}`}
                />
              </div>
              <div className="flex items-center justify-between gap-x-2 p-4 font-bold">
                <span className="truncate" title={c.name ? c.name : '(Unknown)'}>
                  {c.name ? c.name : '(Unknown)'}
                </span>
                <div className="flex shrink-0 items-center">
                  {isInWishlist(wishlist, c.id) ? (
                    <button
                      className="p-1 lg:p-px"
                      onClick={(e) => {
                        e.preventDefault();
                        setStateWishlist(rmCap(c.id));
                      }}
                    >
                      <FontAwesomeIcon
                        id="favStar"
                        title={`Remove from '${wishlist.settings.title.text}' list`}
                        className="top-[14px] cursor-pointer text-yellow-500"
                        icon={['fas', 'star']}
                      />
                    </button>
                  ) : (
                    <button
                      className="p-1 lg:p-px"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInTradeList(wishlist, c.id)) {
                          rmTradeCap(c.id);
                        }
                        if (wishlist.items.length >= WishlistLimit) {
                          setShowExceedAlert(true);
                        } else {
                          setStateWishlist(addCap(c.id));
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        id="favStar"
                        title={`Add to '${wishlist.settings.title.text}' list`}
                        className="top-[14px] cursor-pointer text-slate-500"
                        icon={['fas', 'star']}
                      />
                    </button>
                  )}
                  {isInTradeList(wishlist, c.id) ? (
                    <button
                      className="p-1 lg:p-px"
                      onClick={(e) => {
                        e.preventDefault();
                        setStateWishlist(rmTradeCap(c.id));
                      }}
                    >
                      <FontAwesomeIcon
                        id="favTrade"
                        title={`Remove from '${wishlist.settings.title.text}' trade list`}
                        className="redo-icon cursor-pointer text-yellow-500"
                        icon={['fas', 'redo']}
                      />
                    </button>
                  ) : (
                    <button
                      className="p-1 lg:p-px"
                      onClick={(e) => {
                        e.preventDefault();
                        if (isInWishlist(wishlist, c.id)) {
                          rmCap(c.id);
                        }
                        if (wishlist.tradeItems.length >= TradeListLimit) {
                          setShowExceedAlert(true);
                        } else {
                          setStateWishlist(addTradeCap(c.id));
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        id="favTrade"
                        title={`Add to '${wishlist.settings.title.text}' trade list${isInWishlist(wishlist, c.id) ? ' (and remove from wishlist)' : ''}`}
                        className="redo-icon cursor-pointer text-slate-500"
                        icon={['fas', 'redo']}
                      />
                    </button>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/*
        todo : change this one when it'll be used by the new modal component
        there is an exemple in the colorway page
      */}

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
