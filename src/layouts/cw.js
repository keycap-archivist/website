/* eslint-disable no-return-assign */
import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext } = props;
  const { makerUrl, makerName, sculptUrl, sculptName, colorway } = pageContext;
  const seoTitle = `${makerName} - ${sculptName} - ${colorway.name}`;
  return (
    <Layout>
      <SEO title={seoTitle} img={colorway.img} />
      <div>
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
      <h2 className="text-3xl my-6">
        <span className="font-bold">{colorway.name}</span>
      </h2>
      <div className="flex">
        <div className="flex flex-col md:w-2/5 bg-white p-2 ml-auto mr-auto">
          <div className="w-full h-full bg-gray-300">
            <img className="h-full w-full object-cover" src={colorway.img} />
          </div>
          <div className="flex flex-row justify-between content-center font-bold pt-4 pb-2 px-2">
            <div className="pr-3">{colorway.name}</div>
            <span className="cursor-pointer text-sm text-blue-500 hover:text-blue-800">
              <FontAwesomeIcon icon={['fas', 'link']} />
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Maker;
