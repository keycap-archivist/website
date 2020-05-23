import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
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
      allFile(filter: { relativePath: { glob: "logos/*" } }) {
        nodes {
          name
          relativePath
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  `);
  const img = data.allFile.nodes;

  const getImg = (id) => {
    const f = img.find((x) => x.name === id);
    if (f !== undefined) {
      return f.childImageSharp.fluid;
    }
    return img.find((x) => x.name === 'nologo').childImageSharp.fluid;
  };

  return (
    <Layout>
      <SEO title="Home" />
      <ul className="flex flex-wrap flex-col md:flex-row w-full md:m-0 md:-mx-1">
        {data.allSitePage.nodes.map((element) => (
          <li key={element.id} className="flex md:w-1/4 lg:w-1/5 py-2 md:px-2">
            <Link to={element.path} className="block w-full py-4 font-semibold text-lg text-center border bg-white">
              <div className="w-full h-full bg-gray-300 logo-wrapper">
                <Img fluid={getImg(element.context.maker.id)} className="h-full w-full object-cover" alt="" />
              </div>
              <div className="font-bold pt-4 pb-2 px-2 text-center">
                <div className="pr-3">{element.context.maker.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
