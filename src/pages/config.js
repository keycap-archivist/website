import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getConfig, setConfig } from '../internal/config';

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
      <div className="w-full m-auto lg:w-9/12 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Configuration panel</h1>
        <div className="space-y-6">
          <div className="w-1/3 pr-2">
            <label htmlFor="darkMode" className="flex items-center cursor-pointer">
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
                <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
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
                    <img className="inline-block rounded-full w-16" src={avatar} />
                    <div className="ml-6 inline-block mx-auto">{name}</div>
                  </figure>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <a href={`${baseAPI}/auth/discord`} className="px-4 py-2 bg-discord text-white rounded ">
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
