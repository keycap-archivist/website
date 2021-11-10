import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getFavoriteMakers, addFavMaker, removeFavMaker } from '../internal/favorite';

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

  const favoriteMakers = getFavoriteMakers();

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
              <div className="text-header">
                <div className="font-bold flex flex-row pt-3 px-2 relative">
                  <div className="text-sm text-center w-full px-5">{element.context.maker.name}</div>
                  {favoriteMakers.includes(element.context.maker.id) ? (
                    <FontAwesomeIcon
                      id="favStar"
                      className="m-1 star-icon text-yellow-500 cursor-pointer"
                      icon={['fas', 'star']}
                      onClick={(e) => {
                        e.preventDefault();
                        removeFavMaker(element.context.maker.id);
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      id="favStar"
                      className="m-1 star-icon text-gray-500 cursor-pointer"
                      icon={['fas', 'star']}
                      onClick={(e) => {
                        e.preventDefault();
                        addFavMaker(element.context.maker.id);
                      }}
                    />
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
