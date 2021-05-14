import React, { useState, useEffect } from 'react';

import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getConfig, setConfig, getDefaultConfig } from '../internal/config';

const Config = () => {
  const [config, setStateConfig] = useState(getDefaultConfig());

  useEffect(() => {
    setStateConfig(getConfig());
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
