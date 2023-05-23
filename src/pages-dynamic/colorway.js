/* eslint-disable no-return-assign */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';
import React, { useEffect, useState, useMemo } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Alert from '../components/alert';
import SubmitNameModal from '../components/modals/submit-name';
import TooltipWrapper from '../components/tooltip';
import SEO from '../components/seo';
import ToastWrapper from '../components/toast';
import * as Toast from '@radix-ui/react-toast';

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
import Modal from '../components/modal';
import { cn } from '../internal/twMerge';

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

  const hasAdditionalInfo = useMemo(() => {
    return colorway.releaseDate || colorway.totalCount || colorway.commissioned || colorway.giveaway || false;
  }, [colorway]);

  return (
    <Toast.Provider swipeDirection="right">
      <Layout>
        {showSuccessAlert && (
          <ToastWrapper variant="success" open={showSuccessAlert} onOpenChange={setShowSuccessAlert} className="toast-root rounded-md bg-white p-4 shadow-md">
            <span>Suggestion successfully submitted</span>
          </ToastWrapper>
        )}
        {showErrorAlert && (
          <ToastWrapper variant="error" open={showErrorAlert} onOpenChange={setShowErrorAlert} className="toast-root rounded-md bg-white p-4 shadow-md">
            <span>Suggestion submission failed</span>
          </ToastWrapper>
        )}
        {showExceedAlert && (
          <ToastWrapper variant="error" open={showExceedAlert} onOpenChange={setShowExceedAlert} className="toast-root rounded-md bg-white p-4 shadow-md">
            <span>Wishlist or trade list items exceeded</span>
          </ToastWrapper>
        )}
        <SEO title={seoTitle} img={cwImg} />
        <div className="">
          <div className="mt-6">
            {[
              {
                label: 'Home',
                link: '/',
              },
              {
                label: makerName,
                link: makerUrl,
              },
              {
                label: sculptName,
                link: sculptUrl,
              },
            ].map((x) => (
              <>
                <Link
                  to={x.link}
                  className="text-sm font-medium text-slate-900/60 underline transition-colors hover:text-slate-800/60 dark:text-slate-50/80 dark:hover:text-white/90"
                >
                  {x.label}
                </Link>{' '}
                /{' '}
              </>
            ))}
          </div>

          <div className="my-6 flex flex-col items-center justify-between sm:flex-row">
            <div className="mb-2 pr-3 leading-snug sm:mb-0">
              <h2 className="text-3xl font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</h2>
            </div>
            <div className="mt-1 flex shrink-0 flex-row flex-nowrap items-center"></div>
          </div>
          <div className={cn('mt-12 flex gap-x-8', hasAdditionalInfo ? '' : 'justify-center')}>
            <div className={cn(hasAdditionalInfo ? 'flex basis-1/2' : 'relative w-1/2')}>
              <img loading="lazy" className="block h-full w-full rounded-lg object-cover" alt={seoTitle} src={cwImg} />
              {!hasAdditionalInfo && (
                <div className={cn('absolute right-4 top-4 flex items-center gap-x-3 rounded bg-black/80 p-3')}>
                  {!colorway.name && (
                    <Modal buttonTitle="Suggest name" modalTitle="Suggest name" open={showModal} setOpen={setShowModal}>
                      <SubmitNameModal
                        modalHeader="Suggest Colorway Name"
                        placeholder="Suggested name #1"
                        clwId={colorway.id}
                        setModal={setShowModal}
                        setErrorAlert={setShowErrorAlert}
                        setSuccessAlert={setShowSuccessAlert}
                      />
                    </Modal>
                  )}
                  <CopyToClipboard text={location.href} onCopy={updateText}>
                    <button className="flex items-center justify-center rounded bg-blue-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                      {state.text}
                    </button>
                  </CopyToClipboard>
                  {isInWishlist(wishlist, colorway.id) ? (
                    <TooltipWrapper tooltipTitle={`Remove from "${wishlist.settings.title.text}" wishlist`}>
                      <button
                        onClick={() => setStateWishlist(rmCap(colorway.id))}
                        className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'star']} />
                      </button>
                    </TooltipWrapper>
                  ) : (
                    <TooltipWrapper tooltipTitle={`Add to "${wishlist.settings.title.text}" wishlist`}>
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
                        className="inline-flex items-center justify-center rounded-full bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'star']} />
                      </button>
                    </TooltipWrapper>
                  )}
                  {isInTradeList(wishlist, colorway.id) ? (
                    <TooltipWrapper tooltipTitle={`Remove from "${wishlist.settings.title.text}" trade list`}>
                      <button
                        onClick={() => setStateWishlist(rmTradeCap(colorway.id))}
                        className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'redo']} />
                      </button>
                    </TooltipWrapper>
                  ) : (
                    <TooltipWrapper tooltipTitle={`Add to "${wishlist.settings.title.text}" trade list`}>
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
                        className="inline-flex items-center justify-center rounded-full bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'redo']} />
                      </button>
                    </TooltipWrapper>
                  )}
                </div>
              )}
            </div>
            {hasAdditionalInfo && (
              <div className="flex flex-1 flex-col gap-y-2">
                {colorway.releaseDate ? (
                  <dl className="flex items-center">
                    <FontAwesomeIcon icon={['fa', 'calendar']} />
                    <dd className="mx-2 font-bold">Release date:</dd>
                    <dt>{colorway.releaseDate}</dt>
                  </dl>
                ) : null}
                {colorway.totalCount ? (
                  <dl className="flex items-center">
                    <FontAwesomeIcon icon={['fa', 'calculator']} />
                    <dd className="mx-2 font-bold">Total Count:</dd>
                    <dt>{colorway.totalCount}</dt>
                  </dl>
                ) : null}
                {colorway.commissioned ? (
                  <dl className="flex items-center">
                    <FontAwesomeIcon icon={['fa', 'palette']} />
                    <dd className="mx-2 font-bold">Commissioned</dd>
                  </dl>
                ) : null}
                {colorway.giveaway ? (
                  <dl className="flex items-center">
                    <FontAwesomeIcon icon={['fa', 'gift']} />
                    <dd className="mx-2 font-bold">Giveaway</dd>
                  </dl>
                ) : null}
                <div className={cn('flex items-center gap-x-3', hasAdditionalInfo ? 'mt-6' : null)}>
                  {/* {!colorway.name && ( */}
                  <Modal buttonTitle="Suggest name" modalTitle="Suggest name" open={showModal} setOpen={setShowModal}>
                    <SubmitNameModal
                      modalHeader="Suggest Colorway Name"
                      placeholder="Suggested name #2"
                      clwId={colorway.id}
                      setModal={setShowModal}
                      setErrorAlert={setShowErrorAlert}
                      setSuccessAlert={setShowSuccessAlert}
                    />
                  </Modal>
                  {/* )} */}
                  <CopyToClipboard text={location.href} onCopy={updateText}>
                    <button className="flex items-center justify-center rounded bg-blue-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700">
                      {state.text}
                    </button>
                  </CopyToClipboard>
                  {isInWishlist(wishlist, colorway.id) ? (
                    <TooltipWrapper tooltipTitle={`Remove from "${wishlist.settings.title.text}" wishlist`}>
                      <button
                        onClick={() => setStateWishlist(rmCap(colorway.id))}
                        className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'star']} />
                      </button>
                    </TooltipWrapper>
                  ) : (
                    <TooltipWrapper tooltipTitle={`Add to "${wishlist.settings.title.text}" wishlist`}>
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
                        className="inline-flex items-center justify-center rounded-full bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'star']} />
                      </button>
                    </TooltipWrapper>
                  )}
                  {isInTradeList(wishlist, colorway.id) ? (
                    <TooltipWrapper tooltipTitle={`Remove from "${wishlist.settings.title.text}" trade list`}>
                      <button
                        onClick={() => setStateWishlist(rmTradeCap(colorway.id))}
                        className="inline-flex items-center justify-center rounded-full bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'redo']} />
                      </button>
                    </TooltipWrapper>
                  ) : (
                    <TooltipWrapper tooltipTitle={`Add to "${wishlist.settings.title.text}" trade list`}>
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
                        className="inline-flex items-center justify-center rounded-full bg-green-500 px-3 py-2 text-white transition-colors hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={['fas', 'redo']} />
                      </button>
                    </TooltipWrapper>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </Toast.Provider>
  );
};

export default Maker;
