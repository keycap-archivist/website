import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allSitePage(filter: { context: { type: { eq: "maker" } }, internal: {} }) {
        nodes {
          context {
            maker {
              id
              name
            }
          }
          path
          id
        }
      }
    }
  `);

  return (
    <Layout>
      <SEO title="Home" />
      <ul className="flex flex-wrap flex-col md:flex-row w-full md:m-0 md:-mx-1">
        {data.allSitePage.nodes.map((element) => (
          <li key={element.id} className="flex md:w-1/3 lg:w-1/4 py-1 md:px-2">
            <Link 
              to={element.path} 
              className="block w-full py-4 font-semibold text-lg text-center border border-l-4 bg-white"
            >
              {element.context.maker.name}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
