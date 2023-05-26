import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Provider } from '@radix-ui/react-toast';
import * as Collapsible from '@radix-ui/react-collapsible';

import SEO from '../components/seo';
import { cssColors } from '../internal/misc';
import {
  addWishlist,
  defaultWishlistContainer,
  getWishlistContainer,
  rmCap,
  rmTradeCap,
  rmWishlist,
  setWishlistContainer,
  WishlistContainerLimit,
} from '../internal/wishlist';
import Layout from '../layouts/base';

import Modal from '../components/modal';
import ConfirmDialogModal from '../components/modals/confirm-dialog';
// import BkMaggle from '../assets/img/bkmaggle.png';

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../components/select';
import cn from '../internal/twMerge';
import ToastWrapper from '../components/toast';

const baseAPIurl = 'https://api.keycap-archivist.com/wishlist';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistContainer, setStateWishlist] = useState(defaultWishlistContainer);
  const [fonts] = useState(['BebasNeue', 'PermanentMarker', 'Roboto', 'RedRock']);
  const [showWishlistDeleteModal, setShowWishlistDeleteModal] = useState(false);
  const [isSortableHaveListOpen, setIsSortableHaveListOpen] = React.useState(false);
  const [isSortableTradeListOpen, setIsSortableTradeListOpen] = React.useState(false);
  const [isPreviewCollapsibleOpen, setIsPreviewCollapsibleOpen] = React.useState(true);

  const wishlist = useMemo(
    () => wishlistContainer.wishlists.find((x) => x.id === wishlistContainer.activeWishlistId),
    [wishlistContainer, wishlistContainer.activeWishlistId],
  );

  const [isConfigClosed, setIsConfigClosed] = React.useState(false);

  // Required for SSR
  useEffect(() => {
    setStateWishlist(getWishlistContainer());
  }, []);

  // useEffect(() => {
  //   setIsConfigClosed(!(wishlist?.items.length > 0 || wishlist?.tradeItems.length > 0));
  // }, [wishlist]);

  const errorPlaceholder = () => {
    if (errorLoading) {
      let content = 'Something terrible happened';
      if (typeof errorLoading === 'string') {
        content = errorLoading;
      }
      return (
        <ToastWrapper variant="error" open={errorLoading} onOpenChange={setErrorLoading} className="toast-root rounded-md bg-white p-4 shadow-md">
          <span>{content}</span>
        </ToastWrapper>
      );
    }
    return '';
  };

  const genWishlist = async () => {
    setB64Img(null);
    setErrorLoading(false);
    setWishlistLoading(true);

    const outWishlist = { settings: wishlist.settings };
    outWishlist.capsPerLine = parseInt(outWishlist.capsPerLine, 10);
    outWishlist.tradeCaps = wishlist.tradeItems.map((i) => ({
      id: i.id,
      legendColor: wishlist.settings.tradeTitle.color,
    }));
    outWishlist.caps = wishlist.items.map((i) => ({
      id: i.id,
      isPriority: i.prio,
      legendColor: wishlist.settings.title.color,
    }));

    // Check wishlist
    const checkResult = await axios
      .post(`${baseAPIurl}/check`, outWishlist)
      .then((d) => d.data)
      .catch((e) => {
        console.log(JSON.stringify(e));
        return {
          critical: true,
          log: e,
          stack: e.stack,
          data: e.config.data,
        };
      });
    if (checkResult.critical) {
      setErrorLoading(`A critical error happened:${checkResult.log}\r\n${checkResult.stack}\r\n${checkResult.data}`);
      setWishlistLoading(false);
      return;
    }
    if (checkResult.hasError) {
      let wl;
      for (const c of checkResult.errors) {
        if (outWishlist.caps.findIndex((x) => x.id === c)) {
          wl = rmCap(c);
        }
        if (outWishlist.tradeCaps.findIndex((x) => x.id === c)) {
          wl = rmTradeCap(c);
        }
      }
      setStateWishlist(wl);
      setErrorLoading('Some keycaps were not found in the database. We cleaned up your wishlist. Please try again');
      setWishlistLoading(false);
      return;
    }
    await axios
      .post(`${baseAPIurl}/generate`, outWishlist)
      .then((d) => d.data)
      .then((r) => {
        setB64Img(r.Body);
      })
      .catch((e) => {
        console.log(e);
        setErrorLoading(`A critical error happened:${e}\r\n${e.stack}\r\n${e.config.data}`);
      });
    setWishlistLoading(false);
  };

  const setPriority = (capId, priority) => {
    const idxWishlist = wishlistContainer.wishlists.findIndex((x) => x.id === wishlistContainer.activeWishlistId);
    const idxCap = wishlistContainer.wishlists[idxWishlist].items.findIndex((x) => x.id === capId);
    wishlistContainer.wishlists[idxWishlist].items[idxCap].prio = priority;
    setWishlistContainer(wishlistContainer);
    setStateWishlist({ ...wishlistContainer });
  };

  const setSettingWishlist = (property, key, e, type) => {
    const idxWishlist = wishlistContainer.wishlists.findIndex((x) => x.id === wishlistContainer.activeWishlistId);
    const newWishlistContainer = JSON.parse(JSON.stringify(wishlistContainer)); // make a deep copy of the object
    if (property === 'capsPerLine') {
      newWishlistContainer.wishlists[idxWishlist].settings.capsPerLine = e.target.value;
    } else {
      newWishlistContainer.wishlists[idxWishlist].settings[property][key] = type === 'input' ? e.target.value : e;
    }
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
  };

  const setActiveWishlist = (v) => {
    setB64Img(null);
    wishlistContainer.activeWishlistId = parseInt(v, 10);
    setWishlistContainer(wishlistContainer);
    setStateWishlist({ ...wishlistContainer });
  };

  const addNewWishlist = () => {
    setB64Img(null);
    const newWishlistContainer = addWishlist();
    newWishlistContainer.activeWishlistId = newWishlistContainer.wishlists[newWishlistContainer.wishlists.length - 1].id;
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
  };

  const deleteActiveWishlist = () => {
    setB64Img(null);
    const newWishlistContainer = rmWishlist(wishlistContainer.activeWishlistId);
    newWishlistContainer.activeWishlistId = newWishlistContainer.wishlists[newWishlistContainer.wishlists.length - 1].id;
    setWishlistContainer(newWishlistContainer);
    setStateWishlist({ ...newWishlistContainer });
    setShowWishlistDeleteModal(false);
  };

  const tradelistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="space-y-6"
        list={wishlist ? wishlist.tradeItems : []}
        setList={(e) => {
          // Update the state of the component only
          const activeWishlistIndex = wishlistContainer.wishlists.findIndex((w) => w.id === wishlistContainer.activeWishlistId);
          const activeWishlistCopy = { ...wishlistContainer.wishlists[activeWishlistIndex] };
          activeWishlistCopy.tradeItems = e;
          const wishlistContainerCopy = { ...wishlistContainer };
          wishlistContainerCopy.wishlists[activeWishlistIndex] = activeWishlistCopy;
          setStateWishlist(wishlistContainerCopy);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlistContainer(wishlistContainer);
        }}
      >
        {wishlist.tradeItems.map((x) => (
          <li
            key={x.id}
            className={cn(
              'flex min-h-[150px] items-center gap-x-4 rounded-md bg-white px-4 py-3 transition-shadow',
              'hover:shadow-md',
              'dark:bg-black/30',
              'dark:hover:shadow-none',
            )}
          >
            <img src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`} className="handle h-full max-w-[150px] grow cursor-move rounded-lg" />
            <div className="flex flex-col gap-y-4">
              <FontAwesomeIcon className="handle cursor-move text-2xl" icon={['fas', 'grip-lines']} />
              <button
                onClick={() => setStateWishlist(rmTradeCap(x.id))}
                className="inline-flex items-center justify-center rounded-md bg-red-500 p-2 font-bold text-white transition-colors hover:bg-red-700"
              >
                <FontAwesomeIcon className="trash-alt-icon m-1 cursor-pointer" icon={['fas', 'trash-alt']} />
              </button>
            </div>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  const wishlistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="space-y-6"
        list={wishlist ? wishlist.items : []}
        setList={(e) => {
          // Update the state of the component only
          const activeWishlistIndex = wishlistContainer.wishlists.findIndex((w) => w.id === wishlistContainer.activeWishlistId);
          const activeWishlistCopy = { ...wishlistContainer.wishlists[activeWishlistIndex] };
          activeWishlistCopy.items = e;
          const wishlistContainerCopy = { ...wishlistContainer };
          wishlistContainerCopy.wishlists[activeWishlistIndex] = activeWishlistCopy;
          setStateWishlist(wishlistContainerCopy);
        }}
        onEnd={() => {
          // write the wishlist in the localstorage onEnd only
          setWishlistContainer(wishlistContainer);
        }}
      >
        {wishlist.items.map((x) => (
          <li
            key={x.id}
            className={cn(
              'py-3',
              'transition-shadow',
              'hover:shadow-md',
              'dark:bg-black/30',
              'flex min-h-[150px] w-fit items-center gap-x-4 rounded-md bg-white px-4 dark:hover:shadow-none',
            )}
          >
            <img src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`} className="handle h-full max-w-[150px] grow cursor-move rounded-lg" />
            <div className="flex flex-col gap-y-2">
              <FontAwesomeIcon className="handle cursor-move text-2xl" icon={['fas', 'grip-lines']} />
              {x.prio ? (
                <button
                  onClick={() => setPriority(x.id, false)}
                  className="inline-flex items-center justify-center rounded-md bg-red-500 p-2 font-bold text-white transition-colors hover:bg-red-700"
                >
                  <FontAwesomeIcon id="removePriority" className="arrow-down-icon m-1 cursor-pointer" icon={['fas', 'sort-numeric-down']} />
                </button>
              ) : (
                <button
                  onClick={() => setPriority(x.id, true)}
                  className="inline-flex items-center justify-center rounded-md bg-green-500 p-2 font-bold text-white transition-colors hover:bg-green-700"
                >
                  <FontAwesomeIcon id="addPriority" className="arrow-up-icon m-1 cursor-pointer" icon={['fas', 'sort-numeric-up']} />
                </button>
              )}
              <button
                onClick={() => setStateWishlist(rmCap(x.id))}
                className="inline-flex items-center justify-center rounded-md bg-red-500 p-2 font-bold text-white transition-colors hover:bg-red-700"
              >
                <FontAwesomeIcon id="removeWishlist" className="trash-alt-icon m-1 cursor-pointer" icon={['fas', 'trash-alt']} />
              </button>
            </div>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  const wishlistSettings = () => (
    <>
      <div className="lg:flex lg:gap-x-16">
        <aside
          className={cn(
            'my-6 flex overflow-x-auto border-b border-slate-900/5 py-4',
            'dark:border-slate-100/5',
            'lg:my-0 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20',
          )}
        >
          <nav className="mt-0 flex-none px-0">
            <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              <li>
                <div className="group flex items-center gap-x-3 rounded-md text-lg font-semibold leading-6 text-slate-800 dark:text-slate-200">
                  <FontAwesomeIcon icon={['fas', 'circle']} className="h-2 w-2 text-xl text-indigo-500" />
                  General
                </div>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="p-0 pb-6 lg:flex-auto lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Wishlists allow you to export a custom list of your most desired keycaps to a simple image.
              </p>
              <dl
                className={cn(
                  'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                  'dark:divide-slate-800 dark:border-slate-700',
                )}
              >
                <div className="pt-6 sm:flex sm:items-center">
                  <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Active wishlist</dt>
                  <dd className="mt-4 flex flex-col justify-between gap-x-6 max-lg:gap-y-4 sm:mt-0 sm:flex-auto lg:mt-1 lg:flex-row">
                    <Select
                      value={wishlist.id}
                      onValueChange={(v) => {
                        setActiveWishlist(v);
                      }}
                    >
                      <SelectTrigger className="w-full lg:w-[300px]">
                        <SelectValue placeholder="Select your wishlist" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>All wishlists</SelectLabel>
                          {wishlistContainer.wishlists.map((x) => (
                            <SelectItem key={x.id} value={x.id}>
                              {x.settings.title.text} - {x.items.length + x.tradeItems.length} Items
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center gap-x-2">
                      <button
                        id="addWishlist"
                        onClick={addNewWishlist}
                        className={cn(
                          'inline-flex flex-1 items-center justify-center rounded-md border border-indigo-500 px-3 py-2 text-xs font-bold text-indigo-500',
                          'transition-colors',
                          'hover:border-indigo-600 hover:text-indigo-600',
                          'lg:flex-auto',
                          (wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit) && 'cursor-not-allowed opacity-50',
                        )}
                        disabled={wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit}
                      >
                        Add new wishlist
                      </button>
                      <Modal
                        buttonTitle="Delete active wishlist"
                        modalTitle="Delete active wishlist"
                        open={showWishlistDeleteModal}
                        setOpen={setShowWishlistDeleteModal}
                        disabled={wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit}
                      >
                        <ConfirmDialogModal
                          modalHeader="Delete active wishlist"
                          placeholder={`Are you sure that you want to delete the '${wishlist.settings.title.text}' wishlist?`}
                          setModal={setShowWishlistDeleteModal}
                          onModalConfirm={() => deleteActiveWishlist()}
                        />
                      </Modal>
                    </div>
                  </dd>
                </div>
              </dl>
              <dl
                className={cn(
                  'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                  'dark:divide-slate-800 dark:border-slate-700',
                )}
              >
                <div className="pt-6 sm:flex sm:items-center">
                  <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Generate wishlist</dt>
                  <dd
                    className={cn(
                      'mt-4 flex w-full flex-col sm:mt-0 lg:mt-1 lg:flex-row lg:items-center',
                      !wishlist.items.length && !wishlist.tradeItems.length ? 'justify-between' : 'justify-end',
                    )}
                  >
                    {!wishlist.items.length && !wishlist.tradeItems.length && (
                      <span className="text-sm leading-6 text-slate-500">Add caps to your wishlist or tradelist to generate a wishlist.</span>
                    )}
                    <div className="flex grow items-center gap-x-2 max-lg:mt-2 lg:grow-0">
                      {b64Img ? (
                        <a
                          href={`data:image/png;base64,${b64Img}`}
                          download="wishlist.png"
                          className={cn(
                            'inline-flex flex-1 items-center justify-center rounded-md border border-indigo-500 px-3 py-2 text-xs font-bold text-indigo-500',
                            'transition-colors',
                            'hover:border-indigo-600 hover:text-indigo-600',
                            'lg:flex-auto',
                            wishlistLoading && 'cursor-not-allowed opacity-50',
                          )}
                          disabled={wishlistLoading}
                        >
                          Download wishlist
                        </a>
                      ) : null}
                      <button
                        onClick={genWishlist}
                        className={cn(
                          'inline-flex flex-1 items-center justify-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-colors',
                          'hover:bg-indigo-600',
                          'lg:flex-auto',
                          (wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)) && 'cursor-not-allowed opacity-50',
                        )}
                        disabled={wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)}
                      >
                        {wishlistLoading ? (
                          <>
                            <FontAwesomeIcon className="spinner-icon mr-2" icon={['fas', 'spinner']} spin />
                            <span>Generating wishlist...</span>
                          </>
                        ) : (
                          <>Generate wishlist</>
                        )}
                      </button>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {b64Img ? (
        <Collapsible.Root open={isPreviewCollapsibleOpen} onOpenChange={setIsPreviewCollapsibleOpen} className="mt-6 lg:mt-0">
          <Collapsible.Trigger asChild>
            <div className="flex items-center gap-x-2">
              <FontAwesomeIcon
                icon={['fa', 'chevron-right']}
                className={cn('h-4 w-4 opacity-50', isPreviewCollapsibleOpen ? 'rotate-90 transition-transform' : null)}
              />
              <span className="cursor-pointer font-medium hover:underline">See your image preview</span>
            </div>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <img src={`data:image/png;base64,${b64Img}`} className={cn('w-full rounded-md lg:mx-auto lg:w-1/2')} />
          </Collapsible.Content>
        </Collapsible.Root>
      ) : null}

      <Collapsible.Root open={isConfigClosed} onOpenChange={setIsConfigClosed} className="mt-6 space-y-6">
        <Collapsible.Trigger asChild>
          <div className="flex items-center gap-x-2">
            <FontAwesomeIcon icon={['fa', 'chevron-right']} className={cn('h-4 w-4 opacity-50', isConfigClosed ? 'rotate-90 transition-transform' : null)} />
            <span className="cursor-pointer font-medium hover:underline">Start configurating your list</span>
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="lg:flex lg:gap-x-16">
            <aside
              className={cn(
                'my-6 flex overflow-x-auto border-b border-slate-900/5 py-4',
                'dark:border-slate-100/5',
                'lg:my-0 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20',
              )}
            >
              <nav className="mt-0 flex-none px-0">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                  <li>
                    <div className="group flex items-center gap-x-3 rounded-md text-lg font-semibold leading-6 text-slate-800 dark:text-slate-200">
                      <FontAwesomeIcon icon={['fas', 'circle']} className="h-2 w-2 text-xl text-indigo-500" />
                      Formatting
                    </div>
                  </li>
                </ul>
              </nav>
            </aside>

            <div className="p-0 pb-6 lg:flex-auto lg:py-20">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Tweak the main basic options for formatting your wishlist. These include font family, color, size...
                  </p>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:mt-6 sm:w-64 sm:flex-none sm:pr-6">General formatting options</dt>
                      <dd className="mt-1 grid grid-cols-1 gap-6 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <label htmlFor="capsPerLine" className="text-xs font-medium ">
                            Keycaps per line
                          </label>
                          <input
                            id="capsPerLine"
                            value={wishlist.settings.capsPerLine}
                            onChange={(e) => setSettingWishlist('capsPerLine', '', e, 'input')}
                            className={cn(
                              'w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600',
                              'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
                              'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                              'hover:border-slate-300/100',
                              'dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
                              'dark:placeholder:text-slate-300/50',
                              'dark:hover:border-slate-700/100',
                            )}
                            type="number"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Priority color</span>
                          <Select
                            className="w-fit"
                            value={wishlist.settings.priority.color}
                            onValueChange={(e) => setSettingWishlist('priority', 'color', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your color" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All colors</SelectLabel>
                                {cssColors.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Priority font</span>
                          <Select
                            className="w-fit"
                            value={wishlist.settings.priority.font}
                            onValueChange={(e) => setSettingWishlist('priority', 'font', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your font" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All fonts</SelectLabel>
                                {fonts.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Background color</span>
                          <Select
                            className="w-fit"
                            value={wishlist.settings.background.color}
                            onValueChange={(e) => setSettingWishlist('background', 'color', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your font" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All colors</SelectLabel>
                                {cssColors.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </dd>
                    </div>
                  </dl>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Legends options</dt>
                      <dd className="mt-1 grid w-full grid-cols-1 gap-6 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Legends font</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.legends.font}
                            onValueChange={(e) => setSettingWishlist('legends', 'font', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the legends' font" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All fonts</SelectLabel>
                                {fonts.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Legends color</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.legends.color}
                            onValueChange={(e) => setSettingWishlist('legends', 'color', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the legends' color" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All colors</SelectLabel>
                                {cssColors.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </dd>
                    </div>
                  </dl>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Title options</dt>
                      <dd className="mt-1 grid w-full grid-cols-1 gap-6 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <label htmlFor="wishlistTitle" className="text-xs font-medium ">
                            Wishlist title
                          </label>
                          <input
                            id="wishlistTitle"
                            value={wishlist.settings.title.text}
                            onChange={(e) => setSettingWishlist('title', 'text', e, 'input')}
                            className={cn(
                              'w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600',
                              'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
                              'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                              'hover:border-slate-300/100',
                              'dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
                              'dark:placeholder:text-slate-300/50',
                              'dark:hover:border-slate-700/100',
                            )}
                            type="text"
                            maxLength="50"
                            placeholder={wishlist.tradeItems.length ? 'Want' : 'Wishlist'}
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Title color</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.title.color}
                            onValueChange={(e) => setSettingWishlist('title', 'color', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the title' color" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All colors</SelectLabel>
                                {cssColors.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Title font</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.title.font}
                            onValueChange={(e) => setSettingWishlist('title', 'font', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the title' font" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All fonts</SelectLabel>
                                {fonts.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </dd>
                    </div>
                  </dl>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Extra options</dt>
                      <dd className="mt-1 grid w-full grid-cols-1 gap-6 sm:mt-0 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                          <label htmlFor="extraText" className="text-xs font-medium">
                            Extra text title
                          </label>
                          <input
                            id="extraText"
                            value={wishlist.settings.extraText.text}
                            onChange={(e) => setSettingWishlist('extraText', 'text', e, 'input')}
                            className={cn(
                              'w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600',
                              'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
                              'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                              'hover:border-slate-300/100',
                              'dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
                              'dark:placeholder:text-slate-300/50',
                              'dark:hover:border-slate-700/100',
                            )}
                            type="text"
                            maxLength="50"
                            placeholder="Willing to topup if needed"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Extra text color</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.extraText.color}
                            onValueChange={(e) => setSettingWishlist('extraText', 'color', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the extras text' color" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All colors</SelectLabel>
                                {cssColors.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <span className="text-xs font-medium ">Extra text font</span>
                          <Select
                            className="w-full"
                            value={wishlist.settings.extraText.font}
                            onChange={(e) => setSettingWishlist('extraText', 'font', e, 'select')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select the extras text' font" />
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              <SelectGroup>
                                <SelectLabel>All fonts</SelectLabel>
                                {fonts.map((x) => (
                                  <SelectItem key={x} value={x}>
                                    {x}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:flex lg:gap-x-16">
            <aside
              className={cn(
                'my-6 flex overflow-x-auto border-b border-slate-900/5 py-4',
                'dark:border-slate-100/5',
                'lg:my-0 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20',
              )}
            >
              <nav className="mt-0 flex-none px-0">
                <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                  <li>
                    <div className="group flex items-center gap-x-3 rounded-md text-lg font-semibold leading-6 text-slate-800 dark:text-slate-200">
                      <FontAwesomeIcon icon={['fas', 'circle']} className="h-2 w-2 text-xl text-indigo-500" />
                      Socials
                    </div>
                  </li>
                </ul>
              </nav>
            </aside>

            <div className="p-0 pb-6 lg:flex-auto lg:py-20">
              <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
                <div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">Get your socials in before exporting your wishlist.</p>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Reddit</dt>
                      <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <input
                          className={cn(
                            'basis-1/3 rounded-md border-slate-300/90 pl-3 text-sm text-slate-600',
                            'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
                            'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                            'hover:border-slate-300/100',
                            'dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
                            'dark:placeholder:text-slate-300/50',
                            'dark:hover:border-slate-700/100',
                          )}
                          type="text"
                          value={wishlist.settings.social.reddit}
                          onChange={(e) => setSettingWishlist('social', 'reddit', e, 'input')}
                          placeholder="u/username"
                        />
                      </dd>
                    </div>
                  </dl>
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Discord</dt>
                      <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                        <input
                          className={cn(
                            'basis-1/3 rounded-md border-slate-300/90 pl-3 text-sm text-slate-600',
                            'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
                            'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                            'hover:border-slate-300/100',
                            'dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
                            'dark:placeholder:text-slate-300/50',
                            'dark:hover:border-slate-700/100',
                          )}
                          type="text"
                          value={wishlist.settings.social.discord}
                          onChange={(e) => setSettingWishlist('social', 'discord', e, 'input')}
                          placeholder="Discord#1234"
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      {wishlist.items.length || wishlist.tradeItems.length ? (
        <div className="lg:flex lg:gap-x-16">
          <aside
            className={cn(
              'my-6 flex overflow-x-auto border-b border-slate-900/5 py-4',
              'dark:border-slate-100/5',
              'lg:my-0 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20',
            )}
          >
            <nav className="mt-0 flex-none px-0">
              <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
                <li>
                  <div className="group flex items-center gap-x-3 rounded-md text-lg font-semibold leading-6 text-slate-800 dark:text-slate-200">
                    <FontAwesomeIcon icon={['fas', 'circle']} className="h-2 w-2 text-xl text-indigo-500" />
                    Ordering tradelist
                  </div>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="p-0 pb-6 lg:flex-auto lg:py-20">
            <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
              <div>
                <p className="mt-1 text-sm leading-6 text-slate-500">Order your caps before generating or downloading your list.</p>
                {wishlist.tradeItems.length ? (
                  <dl
                    className={cn(
                      'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                      'dark:divide-slate-800 dark:border-slate-700',
                    )}
                  >
                    <div className="pt-6 sm:flex sm:items-center">
                      <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Have list</dt>
                      <dd className="mt-1 flex items-center  gap-x-6 sm:mt-0 sm:flex-auto">
                        <Collapsible.Root open={isSortableHaveListOpen} onOpenChange={setIsSortableHaveListOpen} className="mt-2 space-y-6 lg:mt-0">
                          <Collapsible.Trigger asChild>
                            <div className="flex items-center gap-x-2">
                              <FontAwesomeIcon
                                icon={['fa', 'chevron-right']}
                                className={cn('h-4 w-4 opacity-50', isSortableHaveListOpen ? 'rotate-90 transition-transform' : null)}
                              />
                              <span className="cursor-pointer font-medium hover:underline">Open your have list to sort it</span>
                            </div>
                          </Collapsible.Trigger>
                          <Collapsible.Content>{tradelistPlaceHolder()}</Collapsible.Content>
                        </Collapsible.Root>
                      </dd>
                    </div>
                  </dl>
                ) : null}
                <dl
                  className={cn(
                    'mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6',
                    'dark:divide-slate-800 dark:border-slate-700',
                  )}
                >
                  <div className="pt-6 sm:flex sm:items-center">
                    <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">
                      &quot;{wishlist.settings.title.text || 'Want'}&quot; list
                    </dt>
                    <dd className="mt-1 flex items-center  gap-x-6 sm:mt-0 sm:flex-auto">
                      <Collapsible.Root open={isSortableTradeListOpen} onOpenChange={setIsSortableTradeListOpen} className="mt-2 space-y-6 lg:mt-0">
                        <Collapsible.Trigger asChild>
                          <div className="flex items-center gap-x-2">
                            <FontAwesomeIcon
                              icon={['fa', 'chevron-right']}
                              className={cn('h-4 w-4 opacity-50', isSortableTradeListOpen ? 'rotate-90 transition-transform' : null)}
                            />
                            <span className="cursor-pointer font-medium hover:underline">Open your wanted artisans list to sort it</span>
                          </div>
                        </Collapsible.Trigger>
                        <Collapsible.Content>{wishlistPlaceHolder()}</Collapsible.Content>
                      </Collapsible.Root>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );

  return (
    <Provider>
      <Layout>
        {errorPlaceholder()}

        <SEO title="Wishlist" img={'/android-chrome-512x512.png'} />
        <h1 className="mt-10 text-xl font-bold lg:text-3xl">Wishlists management</h1>

        {wishlistSettings()}
      </Layout>
    </Provider>
  );
};

export default Wishlist;
