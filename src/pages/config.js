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
      })
      .catch(() => {
        setStateConnected(false);
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
      <div className="w-full m-auto lg:w-9/12 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Config</h1>
        <div className="space-y-6">
          <div className="w-1/3 pr-2">
            <label htmlFor="darkMode" className="flex items-center cursor-pointer">
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
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
              </div>
              <div className="ml-3 font-medium">Dark mode</div>
            </label>
            <label htmlFor="autoCloud" className="flex items-center cursor-pointer">
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
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
              </div>
              <div className="ml-3 font-medium">Auto Cloud Sync</div>
            </label>
            <br />

            <br />
            <br />
            {connected ? (
              <div>
                <label className="px-4 py-2 bg-green-600 text-white rounded ">Connected To Api</label>
                <br />
                <br />
                <button onClick={() => uploadSync(config)} className="px-4 py-2 bg-blue-600 text-white rounded ">
                  <FontAwesomeIcon icon={['fa', 'upload']} /> Upload Wishlist to Cloud
                </button>
                <br />
                <button onClick={() => downloadSync(config)} className="px-4 py-2 bg-blue-600 text-white rounded ">
                  <FontAwesomeIcon icon={['fa', 'download']} /> Download Wishlist from Cloud
                </button>
              </div>
            ) : (
              <div>
                <a href={`${baseAPI}/auth/discord`} className="px-4 py-2 bg-blue-600 text-white rounded ">
                  <FontAwesomeIcon icon={['fab', 'discord']} /> Login with Discord{' '}
                </a>
                <br />
                <label className="px-4 py-2 bg-red-600 text-white rounded ">Not connected</label>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
