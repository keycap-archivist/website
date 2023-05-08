import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
      <div className="m-auto w-full space-y-6 py-10 lg:w-9/12">
        <h1 className="text-3xl font-bold">Configuration panel</h1>
        <div className="space-y-6">
          <div className="w-1/3 pr-2">
            <label htmlFor="darkMode" className="flex cursor-pointer items-center">
              <div className="mr-3 font-medium">Dark mode</div>
              <div className="relative">
                <input
                  name="darkMode"
                  id="darkMode"
                  type="checkbox"
                  className="sr-only"
                  checked={config.darkMode === true}
                  onChange={(e) => {
                    setComponentConfig('darkMode', e.target.checked);
                    if (e.target.checked) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }}
                />
                <div className="h-4 w-10 rounded-full bg-gray-400 shadow-inner"></div>
                <div className="dot absolute -left-1 -top-1 h-6 w-6 rounded-full bg-white shadow transition"></div>
              </div>
            </label>
          </div>
          <div className="pr-2">
            <h2 className="text-xl font-bold">
              Cloud sync{' '}
              <label title={connected ? 'Connected' : 'Not Connected'}>
                <FontAwesomeIcon icon={['fa', 'globe']} className={connected ? 'text-green-600' : 'text-green-600'} />
              </label>
            </h2>
            <p className="text-xs italic">
              Cloud Synchronization feature is currently in Beta. If you encounter any issue please share your problem on github or on discord.
            </p>
            <div className="space-y-6 pt-4">
              {!initiated ? (
                <p className="text-sm italic">Currently loading</p>
              ) : connected ? (
                <React.Fragment>
                  <figure>
                    <img className="inline-block w-16 rounded-full" src={avatar} />
                    <div className="mx-auto ml-6 inline-block">{name}</div>
                  </figure>
                  <label htmlFor="autoCloud" className="flex cursor-pointer items-center">
                    <div className="mr-3 font-medium">Auto Cloud Sync</div>
                    <div className="relative">
                      <input
                        name="autoCloud"
                        id="autoCloud"
                        type="checkbox"
                        className="sr-only"
                        checked={config.cloudAutoSync === true}
                        onChange={(e) => {
                          setComponentConfig('cloudAutoSync', e.target.checked);
                        }}
                      />
                      <div className="h-4 w-10 rounded-full bg-gray-400 shadow-inner"></div>
                      <div className="dot absolute -left-1 -top-1 h-6 w-6 rounded-full bg-white shadow transition"></div>
                    </div>
                  </label>
                  <p className="text-xs italic">This feature will allow you to save every change you make to your wishlist in the Cloud storage.</p>
                  <button onClick={() => uploadSync(config)} className="rounded bg-blue-600 px-4 py-2 text-white ">
                    <FontAwesomeIcon icon={['fa', 'upload']} /> Upload Wishlist to Cloud
                  </button>
                  <p className="text-xs italic">Manually upload your wishlist to the cloud storage</p>
                  <button onClick={() => downloadSync(config)} className="rounded bg-blue-600 px-4 py-2 text-white ">
                    <FontAwesomeIcon icon={['fa', 'download']} /> Download Wishlist from Cloud
                  </button>
                  <p className="text-xs italic">Manually Download your wishlist from the cloud storage</p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <a href={`${baseAPI}/auth/discord`} className="rounded bg-discord px-4 py-2 text-white ">
                    <FontAwesomeIcon icon={['fab', 'discord']} /> Login with Discord{' '}
                  </a>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
