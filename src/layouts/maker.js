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
            }
          }
          path
        }
      }
    }
  `);
  const getLink = (id) => {
    const n = allSitePage.nodes.find((x) => x.context.sculpt.id === id);
    return n ? n.path : '';
  };

  return (
    <Layout>
      <h2 className="text-4xl mb-3">{maker.name}</h2>
      <h3 className="text-xl">Sculpts</h3>
      <ul className="flex flex-col my-3 space-y-3">
        {maker.sculpts.map((s) => (
          <li key={s.id}>
            <Link to={getLink(s.id)}>
              <span className="font-bold">{s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
