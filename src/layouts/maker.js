import React from 'react';
import { Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker } = pageContext;

  return (
    <Layout>
      <SEO title={maker.name} />
      <div>
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
      </div>
      <h2 className="text-3xl my-6">
        <span className="font-bold">{maker.name}</span>
      </h2>
      <h3 className="text-xl">Sculpts</h3>
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {maker.sculpts.map((s) => (
          <li key={s.id} className="flex h-auto w-1/2 md:w-1/4 lg:w-1/5 py-1 px-1">
            <Link
              to={s.link}
              className="
                flex
                flex-col
                justify-between
                max-w-full
                min-w-full
                bg-white
                p-2
                bg-white
                hover:text-blue-600
                shadow-xs
                hover:shadow-md
                pb-4"
            >
              <div className="w-full h-full thumbnail-wrapper">
                <img src={s.previewImg} className="h-full w-full object-cover" />
              </div>
              <div className="font-bold pt-3 px-2 text-center">
                <div className="text-sm">{s.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
