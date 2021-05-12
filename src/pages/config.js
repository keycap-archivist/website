import React from 'react';

import Layout from '../layouts/base';
import SEO from '../components/seo';

const Config = () => (
  <Layout>
    <SEO title="Configuration" img={'/android-chrome-512x512.png'} />
    <div className="w-full m-auto lg:w-9/12 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Config</h1>
      <div className="space-y-6">
        <p>Foobar</p>
      </div>
    </div>
  </Layout>
);

export default Config;
