/* eslint-disable no-return-assign */
import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { maker, makerUrl, sculpt } = pageContext;

  const seoTitle = `${maker.name} - ${sculpt.name}`;
  return (
    <Layout>
      <SEO title={seoTitle} img={sculpt.previewImg} />
      <h2 className="text-3xl my-6">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
        <span className="text-gray-400"> / </span>
        <Link to={makerUrl} className="text-blue-600">
          {maker.name}
        </Link>
        <span className="text-gray-400"> / </span>
        <span className="font-bold">{sculpt.name}</span>
      </h2>
      <ul className="flex flex-wrap flex-col md:flex-row w-full md:-mx-2">
        {sculpt.colorways.map((c) => (
          <li key={c.id} id={c.id} className={'flex w-64 mx-auto md:m-0 md:w-1/3 lg:w-1/5 py-2 md:px-2'}>
            <Link to={`${location.pathname}/${c.id}`} className="flex flex-col max-w-full min-w-full bg-white p-2">
              <div className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <img className="h-full w-full object-cover" src={c.img} />
              </div>
              <div className="font-bold pt-4 pb-2 px-2 text-center">
                <div className="pr-3">{c.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
