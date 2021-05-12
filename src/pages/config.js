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
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="darkMode">
              dark Mode
            </label>
            <input
              type="checkbox"
              name="darkMode"
              id="darkMode"
              className="form-switch-checkbox"
              checked={config.darkMode === true}
              onChange={(e) => {
                setComponentConfig('darkMode', e.target.checked);
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Config;
