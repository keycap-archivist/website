/* eslint-disable no-return-assign */
import React, { useState } from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${colorway.name} ${sculptName}`;
  const [state, setState] = useState({ text: 'Copy link' });

  const updateText = () => {
    setState({ text: 'Copied!' });
  };

  return (
    <Layout>
      <SEO title={seoTitle} img={colorway.img} />
      <div className="lg:w-2/5 mx-auto">
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
          <h2 className="text-3xl mb-2 mr-2 leading-snug sm:mb-0">
            <span className="font-bold leading-none">{colorway.name ? colorway.name : '(Unknown)'}</span>
          </h2>
          <div className="flex-shrink-0 mt-1">
            <CopyToClipboard text={location.href} onCopy={updateText}>
              <button className="block bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-3 rounded">
                {state.text}
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <div className="flex bg-white">
          <div className="flex flex-col p-5 mx-auto">
            <div className="w-full h-full bg-gray-300">
              <img className="block h-full w-full object-cover" src={colorway.img} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Maker;
