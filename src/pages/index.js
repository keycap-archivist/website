import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import Layout from '../layouts/base';
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
            fluid(maxWidth: 300) {
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
      <SEO title="" img={'/android-icon-512x512.png'} />
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {data.allSitePage.nodes.map((element) => (
          <li key={element.id} className="flex h-auto w-1/2 md:w-1/4 lg:w-1/5 py-1 px-1">
            <Link
              to={element.path}
              className="
                block
                w-full
                pb-4
                border
                bg-white
                hover:text-blue-600
                shadow-xs
                hover:shadow-md"
            >
              <div className="w-full bg-white border-b-2 border-gray-300">
                <Img
                  fluid={getImg(element.context.maker.id)}
                  className="block"
                  alt={element.context.maker.name}
                  width="500"
                  height="500"
                />
              </div>
              <div className="font-bold pt-3 px-2 text-center">
                <div className="text-sm">{element.context.maker.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
