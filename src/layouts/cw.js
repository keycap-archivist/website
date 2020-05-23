/* eslint-disable no-return-assign */
import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${sculptName} - ${colorway.name}`;

  return (
    <Layout>
      <SEO title={seoTitle} img={colorway.img} />
      <div className="pt-4">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
        <span className="text-gray-400"> / </span>
        <Link to={makerUrl} className="text-blue-600">
          {makerName}
        </Link>
        <span className="text-gray-400"> / </span>
        <Link to={sculptUrl} className="text-blue-600">
          {sculptName}
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row justify-between my-6">
        <h2 className="text-3xl mb-2 sm:mb-0">
          <span className="font-bold leading-none">{colorway.name}</span>
        </h2>
        <div className="flex-shrink-0 mt-1">
          <CopyToClipboard text={window.location.href}>
            <button className="block bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-3 rounded">
              Copy link
            </button>
          </CopyToClipboard>
        </div>
      </div>
      <div className="flex">
        <div className="flex flex-col md:w-2/5 bg-white p-2">
          <div className="w-full h-full bg-gray-300">
            <img className="h-full w-full object-cover" src={colorway.img} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Maker;
