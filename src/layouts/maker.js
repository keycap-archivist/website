import React from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';

import Layout from '../components/layout';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker } = pageContext;
  const { allSitePage } = useStaticQuery(graphql`
    query getLink {
      allSitePage(filter: { context: { type: { eq: "sculpt" } } }) {
        nodes {
          context {
            sculpt {
              id
              colorways {
                img
              }
            }
          }
          path
        }
      }
    }
  `);

  const getImg = (id) => {
    const n = allSitePage.nodes.find((x) => x.context.sculpt.id === id);
    const rng = Math.floor(Math.random() * n.context.sculpt.colorways.length);
    return n ? n.context.sculpt.colorways[rng].img : '';
  };

  const getLink = (id) => {
    const n = allSitePage.nodes.find((x) => x.context.sculpt.id === id);
    return n ? n.path : '';
  };

  return (
    <Layout>
      <h2 className="text-4xl mb-3">{maker.name}</h2>
      <h3 className="text-xl">Sculpts</h3>
      <ul className="flex flex-wrap flex-col md:flex-row w-full md:-mx-2">
        {maker.sculpts.map((s) => (
          <li key={s.id} className="flex md:w-1/3 lg:w-1/5 py-3 md:px-2 text-center">
            <Link to={getLink(s.id)}>
              <img src={getImg(s.id)} className="block max-w-full min-w-full" />
              <span className="font-bold">{s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
