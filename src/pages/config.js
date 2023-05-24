import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Switch from '@radix-ui/react-switch';

import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getConfig, setConfig } from '../internal/config';
import { uploadSync, downloadSync } from '../internal/wishlist';

axios.defaults.withCredentials = true;

const baseAPI = 'https://api.keycap-archivist.com';

const Config = () => {
  const [config, setStateConfig] = useState(getConfig());
  const [connected, setStateConnected] = useState(false);
  const [initiated, setStateInitiated] = useState(false);
  const [avatar, setStateAvatar] = useState(null);
  const [name, setStateName] = useState(null);

  useEffect(() => {
    setStateConfig(getConfig());
    axios
      .get(`${baseAPI}/auth/current-session`, { timeout: 20000 })
      .then(({ data }) => {
        console.log(data);
        config.authorized = true;
        setStateConfig(config);
        setConfig(config);
        setStateConnected(true);
        setStateAvatar(data.avatar);
        setStateName(data.name);
        setStateInitiated(true);
      })
      .catch(() => {
        setStateConnected(false);
        setStateAvatar(null);
        setStateName(null);
        setStateInitiated(true);
      });
  }, []);

  const setComponentConfig = (property, value) => {
    config[property] = value;
    setConfig(config);
    setStateConfig({ ...config });
  };

  return (
    <Layout>
      <SEO title="Configuration" img={'/android-chrome-512x512.png'} />
      <h1 className="mt-10 text-xl font-bold lg:text-3xl">Configuration panel</h1>
      <div className="lg:flex lg:gap-x-16">
        <aside className="my-6 flex overflow-x-auto border-b border-slate-900/5 py-4 dark:border-slate-100/5 lg:my-0 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-20">
          <nav className="mt-0 flex-none px-0">
            <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
              <li>
                <div className="group flex gap-x-3 rounded-md text-lg font-semibold leading-6 text-slate-800 dark:text-slate-200">
                  <FontAwesomeIcon icon={['fas', 'user']} className="text-xl h-2 w-2 text-indigo-500" />
                  Cloudsync
                </div>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="p-0 pb-6 lg:flex-auto lg:py-20">
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Cloud Synchronization feature is currently in beta. If you encounter any issue please share your problem on Github or on Discord.
              </p>
              {!initiated ? (
                <p className="pt-6 text-sm font-semibold">Currently loading...</p>
              ) : (
                <dl className="mt-6 space-y-6 divide-y divide-slate-100 border-t border-slate-200 text-sm leading-6 dark:divide-slate-800 dark:border-slate-700">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Discord ID</dt>
                    <dd className="mt-4 lg:mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="inline-flex items-center gap-x-2 text-slate-900 dark:text-slate-100">
                        <img className="inline-block h-6 w-6 rounded-full" src={avatar} />
                        <span>{name}</span>
                      </div>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Cloud sync</dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-slate-900 dark:text-slate-100">
                        This feature will allow you to save every change you make to your wishlist in the cloud storage.
                      </div>
                      <Switch.Root
                        checked={config.cloudAutoSync === true}
                        onCheckedChange={(checked) => {
                          setComponentConfig('cloudAutoSync', checked);
                        }}
                        className="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-slate-200 data-[state=unchecked]:dark:bg-slate-700"
                      >
                        <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 dark:bg-slate-800" />
                      </Switch.Root>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Upload wishlist</dt>
                    <dd className="mt-1 flex flex-col justify-between gap-x-6 max-lg:gap-y-4 sm:mt-0 sm:flex-auto lg:flex-row">
                      <div className="text-slate-900 dark:text-slate-100">Manually upload your wishlist to the cloud storage</div>
                      <button
                        onClick={() => uploadSync(config)}
                        className="inline-flex w-full items-center justify-center gap-x-2 rounded-md bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 lg:w-fit"
                      >
                        <FontAwesomeIcon icon={['fa', 'upload']} /> Upload wishlist
                      </button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-slate-900 dark:text-slate-100 sm:w-64 sm:flex-none sm:pr-6">Download wishlist</dt>
                    <dd className="mt-1 flex flex-col justify-between gap-x-6 max-lg:gap-y-4 sm:mt-0 sm:flex-auto lg:flex-row">
                      <div className="text-slate-900 dark:text-slate-100">Manually download your wishlist from the cloud storage</div>
                      <button
                        onClick={() => downloadSync(config)}
                        className="inline-flex items-center justify-center gap-x-2 rounded-md bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                      >
                        <FontAwesomeIcon icon={['fa', 'download']} /> Download wishlist
                      </button>
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
