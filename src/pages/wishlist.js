import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { ReactSortable } from 'react-sortablejs';

import flip from '../assets/img/flip-machine.png';
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
import clsx from 'clsx';

const baseAPIurl = 'https://api.keycap-archivist.com/wishlist';

const Wishlist = () => {
  const [b64Img, setB64Img] = useState(null);
  const [errorLoading, setErrorLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistContainer, setStateWishlist] = useState(defaultWishlistContainer);
  const [fonts] = useState(['BebasNeue', 'PermanentMarker', 'Roboto', 'RedRock']);
  const [showWishlistDeleteModal, setShowWishlistDeleteModal] = useState(false);

  const wishlist = useMemo(
    () => wishlistContainer.wishlists.find((x) => x.id === wishlistContainer.activeWishlistId),
    [wishlistContainer, wishlistContainer.activeWishlistId],
  );

  console.log(wishlist, wishlistContainer);

  // const wishlist = wishlistContainer.wishlists[0];

  // Required for SSR
  useEffect(() => {
    setStateWishlist(getWishlistContainer());
  }, []);

  const loadingPlaceholder = () => {
    if (wishlistLoading) {
      return (
        <div className="text-center">
          <p className="animate-pulse text-lg">Currently loading</p>
          <img src={flip} className="max-w-half animate-spin-slow mx-auto animate-pulse" />
        </div>
      );
    }
    return '';
  };

  const errorPlaceholder = () => {
    if (errorLoading) {
      let content = 'Something terrible happened';
      if (typeof errorLoading === 'string') {
        content = errorLoading;
      }
      return <div className="text-center">{content}</div>;
    }
    return '';
  };

  // prettier and eslint are dumb on this somehow
  // eslint-disable-next-line no-confusing-arrow
  const imgPlaceholder = () => (b64Img && !wishlistLoading ? <img src={`data:image/png;base64,${b64Img}`} className="mx-auto max-w-full" /> : '');

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

  const wishlistSettings = () => (
    <>
      <div className="lg:flex lg:gap-x-16">
        <aside className="flex overflow-x-auto border-b border-slate-900/5 py-4 dark:border-slate-100/5 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
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

        <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Wishlists allow you to export a custom list of your most desired keycaps to a simple image.
              </p>
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
                <div className="pt-6 sm:flex sm:items-center">
                  <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Active wishlist</dt>
                  <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <Select
                      className="w-fit"
                      value={wishlist.id}
                      onValueChange={(v) => {
                        setActiveWishlist(v);
                      }}
                    >
                      <SelectTrigger className="w-[300px] truncate">
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
                    <div className="sm:flex sm:items-center sm:gap-x-2">
                      <button
                        id="addWishlist"
                        onClick={addNewWishlist}
                        className={`inline-flex items-center justify-center rounded-md bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 ${
                          (wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit) && 'cursor-not-allowed opacity-50'
                        }`}
                        disabled={wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit}
                      >
                        Add new wishlist
                      </button>
                      <Modal
                        buttonTitle="Delete active wishlist"
                        modalTitle="Delete active wishlist"
                        open={showWishlistDeleteModal}
                        setOpen={setShowWishlistDeleteModal}
                      >
                        <ConfirmDialogModal
                          modalHeader="Delete active wishlist"
                          placeholder={`Are you sure that you want to delete the '${wishlist?.settings.title.text}' wishlist?`}
                          setModal={setShowWishlistDeleteModal}
                          onModalConfirm={() => deleteActiveWishlist()}
                        />
                      </Modal>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex lg:gap-x-16">
        <aside className="flex overflow-x-auto border-b border-slate-900/5 py-4 dark:border-slate-100/5 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
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

        <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Tweak the main basic options for formatting your wishlist. These include font family, color, size...
              </p>
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
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
                        className="w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100"
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
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
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
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
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
                        className="w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100"
                        type="text"
                        maxLength="50"
                        placeholder={wishlist.tradeItems.length ? 'Want' : 'Wishlist'}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-medium ">Title color</span>
                      <Select className="w-full" value={wishlist.settings.title.color} onValueChange={(e) => setSettingWishlist('title', 'color', e, 'select')}>
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
                      <Select className="w-full" value={wishlist.settings.title.font} onValueChange={(e) => setSettingWishlist('title', 'font', e, 'select')}>
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
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
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
                        className="w-full rounded-md border-slate-300/90 pl-3 text-sm text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100"
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
                        onValueChange={(e) => setSettingWishlist('extraText', 'color', e, 'input')}
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
        <aside className="flex overflow-x-auto border-b border-slate-900/5 py-4 dark:border-slate-100/5 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
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

        <div className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <p className="mt-1 text-sm leading-6 text-slate-500">Get your socials in before exporting your wishlist.</p>
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
                <div className="pt-6 sm:flex sm:items-center">
                  <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Reddit</dt>
                  <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      className="basis-1/3 rounded-md border-slate-300/90 pl-3 text-sm text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100"
                      type="text"
                      value={wishlist.settings.social.reddit}
                      onChange={(e) => setSettingWishlist('social', 'reddit', e, 'input')}
                      placeholder="u/username"
                    />
                  </dd>
                </div>
              </dl>
              <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
                <div className="pt-6 sm:flex sm:items-center">
                  <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Discord</dt>
                  <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                    <input
                      className="basis-1/3 rounded-md border-slate-300/90 pl-3 text-sm text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100"
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

      {/* <div className="mb-4">
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="activeWishlist">
              Active Wishlist
            </label>
            <select
              id="activeWishlist"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.id}
              onChange={(e) => setActiveWishlist(e)}
            ></select>
          </div>
          <div className="flex w-1/3 justify-center pr-2">
            <button
              id="addWishlist"
              onClick={addNewWishlist}
              className={`mt-7 w-2/3 rounded bg-blue-500 px-4 py-2 font-bold text-white disabled:bg-slate-600 hover:bg-blue-700 ${
                (wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit) && 'cursor-not-allowed opacity-50'
              }`}
              disabled={wishlistLoading || wishlistContainer.wishlists.length >= WishlistContainerLimit}
            >
              Add New Wishlist
            </button>
          </div>
          <div className="flex w-1/3 justify-center pr-2">
            <Modal buttonTitle="Delete active wishlist" modalTitle="Delete active wishlist" open={showWishlistDeleteModal} setOpen={setShowWishlistDeleteModal}>
              <ConfirmDialogModal
                modalHeader="Delete Active Wishlist ?"
                placeholder={`Are you sure that you want to delete the '${wishlist.settings.title.text}' wishlist?`}
                setModal={setShowWishlistDeleteModal}
                onModalConfirm={() => deleteActiveWishlist()}
              />
            </Modal>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="capsPerLine">
              No. Keycaps Per Line
            </label>
            <input
              id="capsPerLine"
              value={wishlist.settings.capsPerLine}
              onChange={(e) => setSettingWishlist('capsPerLine', '', e)}
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="number"
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="priorityColor">
              Priority Color
            </label>
            <select
              id="priorityColor"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.priority.color}
              onChange={(e) => setSettingWishlist('priority', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="priorityFont">
              Priority Font
            </label>
            <select
              id="priorityFont"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.priority.font}
              onChange={(e) => setSettingWishlist('priority', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="legendsFont">
              Legends Font
            </label>
            <select
              id="legendsFont"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.legends.font}
              onChange={(e) => setSettingWishlist('legends', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="legendsColor">
              Legends Color
            </label>
            <select
              id="legendsColor"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.legends.color}
              onChange={(e) => setSettingWishlist('legends', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="backgroundColor">
              Background Color
            </label>
            <select
              id="backgroundColor"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.background.color}
              onChange={(e) => setSettingWishlist('background', 'color', e)}
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
      {wishlist.tradeItems.length ? (
        <div className="mb-4">
          <div className="mt-2 flex flex-wrap">
            <div className="w-1/3 pr-2">
              <label className="mb-2 block border-slate-100 text-sm font-bold text-slate-700" htmlFor="tradeTitleText">
                Trade Text
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
                id="tradeTitleText"
                type="text"
                value={wishlist.settings.tradeTitle.text}
                onChange={(e) => setSettingWishlist('tradeTitle', 'text', e)}
                placeholder="Have"
              />
            </div>
            <div className="w-1/3 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleColor">
                Trade Title Color
              </label>
              <select
                id="tradeTitleColor"
                className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
                type="select"
                value={wishlist.settings.tradeTitle.color}
                onChange={(e) => setSettingWishlist('tradeTitle', 'color', e)}
              >
                {cssColors.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/3 pr-2">
              <label className="wishlist_form" htmlFor="tradeTitleFont">
                Trade Title Font
              </label>
              <select
                id="tradeTitleFont"
                className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
                type="select"
                value={wishlist.settings.tradeTitle.font}
                onChange={(e) => setSettingWishlist('tradeTitle', 'font', e)}
              >
                {fonts.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        ''
      )} */}

      {/* <div className="mb-4">
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleText">
              Title
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              id="titleText"
              type="text"
              value={wishlist.settings.title.text}
              maxLength="50"
              onChange={(e) => setSettingWishlist('title', 'text', e)}
              placeholder={wishlist.tradeItems.length ? 'Want' : 'Wishlist'}
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleColor">
              Title Color
            </label>
            <select
              id="titleColor"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.title.color}
              onChange={(e) => setSettingWishlist('title', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="titleFont">
              Title Font
            </label>
            <select
              id="titleFont"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.title.font}
              onChange={(e) => setSettingWishlist('title', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraText">
              Extra Text
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              id="extraText"
              type="text"
              maxLength="50"
              value={wishlist.settings.extraText.text}
              onChange={(e) => setSettingWishlist('extraText', 'text', e)}
              placeholder="Willing to topup if needed"
            />
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraColor">
              Extra Color
            </label>
            <select
              id="extraColor"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.extraText.color}
              onChange={(e) => setSettingWishlist('extraText', 'color', e)}
            >
              {cssColors.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/3 pr-2">
            <label className="wishlist_form" htmlFor="extraFont">
              Extra Font
            </label>
            <select
              id="extraFont"
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              type="select"
              value={wishlist.settings.extraText.font}
              onChange={(e) => setSettingWishlist('extraText', 'font', e)}
            >
              {fonts.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/2 pr-2">
            <label className="wishlist_font" htmlFor="socialReddit">
              Reddit
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none rounded border border-slate-100 px-3 py-2 leading-tight text-slate-700 shadow focus:outline-none"
              id="socialReddit"
              type="text"
              value={wishlist.settings.social.reddit}
              onChange={(e) => setSettingWishlist('social', 'reddit', e)}
              placeholder="u/username"
            />
          </div>
          <div className="w-1/2 pr-2">
            <label className="wishlist_font" htmlFor="socialDiscord">
              Discord
            </label>
            <input
              className="focus:shadow-outline w-full appearance-none
              rounded border
              border-slate-100 px-3 py-2 leading-tight text-slate-700
              shadow focus:outline-none"
              id="socialDiscord"
              type="text"
              value={wishlist.settings.social.discord}
              onChange={(e) => setSettingWishlist('social', 'discord', e)}
              placeholder="Discord#1234"
            />
          </div>
        </div>
      </div> */}
    </>
  );

  const wishlistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="mt-6"
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
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="handle mr-6 inline-block cursor-move text-3xl" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`}
              className="handle mr-6 inline-block max-h-full cursor-move rounded-lg"
            />
            <span></span>
            {x.prio ? (
              <button
                onClick={() => setPriority(x.id, false)}
                className="mr-6 inline-block rounded border border-red-700 bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
              >
                <FontAwesomeIcon id="removePriority" className="arrow-down-icon m-1 cursor-pointer" icon={['fas', 'sort-numeric-down']} />
              </button>
            ) : (
              <button
                onClick={() => setPriority(x.id, true)}
                className="mr-6 inline-block rounded border border-green-700 bg-green-500 px-2 py-1 font-bold text-white hover:bg-green-700"
              >
                <FontAwesomeIcon id="addPriority" className="arrow-up-icon m-1 cursor-pointer" icon={['fas', 'sort-numeric-up']} />
              </button>
            )}
            <button
              onClick={() => setStateWishlist(rmCap(x.id))}
              className="mr-6 inline-block rounded border border-red-700 bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
            >
              <FontAwesomeIcon id="removeWishlist" className="trash-alt-icon m-1 cursor-pointer" icon={['fas', 'trash-alt']} />
            </button>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  const tradelistPlaceHolder = () => (
    <>
      <ReactSortable
        handle=".handle"
        tag="ul"
        className="mt-6"
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
          <li key={x.id} className="mt-2" style={{ minHeight: '150px' }}>
            <FontAwesomeIcon className="handle mr-6 inline-block cursor-move text-3xl" icon="align-justify" />
            <img
              style={{ maxWidth: '150px' }}
              src={`https://cdn.keycap-archivist.com/keycaps/250/${x.id}.jpg`}
              className="handle mr-6 inline-block max-h-full cursor-move rounded-lg"
            />
            <span></span>
            <button
              onClick={() => setStateWishlist(rmTradeCap(x.id))}
              className="mr-6 inline-block rounded border border-red-700 bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
            >
              <FontAwesomeIcon id="removeTradeList" className="trash-alt-icon m-1 cursor-pointer" icon={['fas', 'trash-alt']} />
            </button>
          </li>
        ))}
      </ReactSortable>
    </>
  );

  return (
    <Layout>
      <SEO title="Wishlist" img={'/android-chrome-512x512.png'} />
      <h1 className="mt-10 text-3xl font-bold">Wishlists management</h1>
      {errorPlaceholder()}
      {loadingPlaceholder()}
      {imgPlaceholder()}
      {wishlistSettings()}

      <div className="flex flex-col gap-4 md:flex-row md:justify-end">
        {!wishlist.items.length && !wishlist.tradeItems.length && (
          <span className={'mt-2 font-medium'}>Add caps to your wishlist or tradelist to generate a wishlist.</span>
        )}
        {b64Img ? (
          <a
            href={`data:image/png;base64,${b64Img}`}
            download="wishlist.png"
            className={clsx(
              'inline-flex items-center justify-center self-end rounded bg-green-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-green-600',
              wishlistLoading && 'cursor-not-allowed opacity-50',
            )}
            disabled={wishlistLoading}
          >
            Download wishlist
          </a>
        ) : null}
        <button
          onClick={genWishlist}
          className={clsx(
            'inline-flex items-center justify-center self-end rounded bg-indigo-500 px-3 py-2 font-semibold text-white transition-colors hover:bg-indigo-600',
            (wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)) && 'cursor-not-allowed opacity-50',
          )}
          disabled={wishlistLoading || (!wishlist.items.length && !wishlist.tradeItems.length)}
        >
          Generate wishlist
        </button>
      </div>
      {wishlist.tradeItems.length ? (
        <div className="mt-2 flex flex-wrap">
          <div className="w-1/2 pr-2">
            <label
              className="mb-2 block border-slate-100
                text-sm font-bold
                text-slate-700"
              htmlFor="haveText"
            >
              {wishlist.settings.tradeTitle.text || 'Have'}
            </label>
            {tradelistPlaceHolder()}
          </div>
          <div className="w-1/2 pr-2">
            <label
              className="mb-2 block border-slate-100
                text-sm font-bold
                text-slate-700"
              htmlFor="wantText"
            >
              {wishlist.settings.title.text || 'Want'}
            </label>
            {wishlistPlaceHolder()}
          </div>
        </div>
      ) : (
        wishlistPlaceHolder()
      )}
    </Layout>
  );
};

export default Wishlist;
