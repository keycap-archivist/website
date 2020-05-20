import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext, location } = props;
  const { maker, makerUrl, sculpt } = pageContext;

  let seoTitle = `${maker.name} - ${sculpt.name}`;
  if (location.hash) {
    seoTitle += ` ${sculpt.colorways.find((x) => x.id === location.hash.replace('#', '')).name}`;
  }

  return (
    <Layout>
      <SEO title={seoTitle} />
      <h2 className="text-3xl mb-3">
        <Link to={makerUrl}>{maker.name}</Link> / <span className="font-bold">{sculpt.name}</span>
      </h2>
      <ul className="flex flex-row flex-wrap w-full md:-mx-2">
        {sculpt.colorways.map((c) => (
          <li key={c.id} id={c.id} className="md:w-1/4 lg:w-1/6 py-3 md:px-2 text-center">
            <img className="block max-w-full min-w-full" src={c.img} />
            <p>
              <CopyToClipboard text={`${location.href}#${c.id}`}>
                <span className="cursor-pointer hover:text-blue-700">
                  <FontAwesomeIcon icon={['fas', 'link']} />
                </span>
              </CopyToClipboard>
              {c.name}
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
