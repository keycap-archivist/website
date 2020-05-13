import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allSitePage(
        filter: { context: { type: { eq: "maker" } }, internal: {} }
      ) {
        nodes {
          context {
            maker {
              id
              name
            }
          }
          path
        }
      }
    }
  `);

  return (
    <Layout>
      <h1>Hello world</h1>
      <ul>
        {data.allSitePage.nodes.map((element) => {
          return (
            <li>
              <Link to={element.path}>{element.context.maker.name}</Link>
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default IndexPage;
