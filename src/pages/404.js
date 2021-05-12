import React from 'react';

import Layout from '../layouts/base';
import SEO from '../components/seo';

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" img={'/android-chrome-512x512.png'} />
    <div className="w-full m-auto lg:w-9/12 py-10 space-y-6">
      <h1 className="text-3xl font-bold">NOT FOUND</h1>
      <div className="space-y-6">
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </div>
  </Layout>
);

export default NotFoundPage;
