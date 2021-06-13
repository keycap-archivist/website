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
          <li key={element.id} className="maker_tile_item">
            <Link to={element.path} className="tile_block">
              <div className="img_holder">
                <Img fluid={getImg(element.context.maker.id)} className="block" alt={element.context.maker.name} width="500" height="500" />
              </div>
              <div className="text_header">
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
