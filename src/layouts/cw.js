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
      <h2 className="text-3xl my-6">
        <Link to={makerUrl}>{makerName}</Link> / <Link to={sculptUrl}>{sculptName}</Link> /{' '}
        <span className="font-bold">{colorway.name}</span>
      </h2>
      <div className="flex flex-wrap flex-col md:flex-row w-1/2 md:-mx-2">
        <div className="flex flex-col max-w-full min-w-full bg-white p-2">
          <div className="w-full h-full bg-gray-300 thumbnail-wrapper">
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
