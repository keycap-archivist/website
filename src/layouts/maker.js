import React from 'react';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker } = pageContext;

  return (
    <Layout>
      <SEO title={maker.name} />
      <h2 className="text-4xl my-6">{maker.name}</h2>
      <h3 className="text-xl">Sculpts</h3>
      <ul className="flex flex-wrap flex-col md:flex-row w-full md:-mx-2">
        {maker.sculpts.map((s) => (
          <li key={s.id} className="flex w-64 mx-auto md:m-0 md:w-1/3 lg:w-1/5 py-2 md:px-2 text-center">
            <Link to={s.link} className="flex flex-col justify-between max-w-full min-w-full bg-white p-2">
              <div className="w-full h-full bg-gray-300 thumbnail-wrapper">
                <img src={s.previewImg} className="h-full w-full object-cover" />
              </div>
              <div className="font-bold p-4">{s.name}</div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
