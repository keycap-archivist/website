import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getFavoriteMakers, addFavMaker, removeFavMaker } from '../internal/favorite';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query MyQuery {
      allSitePage(filter: { id: { glob: "SitePage /maker/*" } }) {
        nodes {
          pageContext
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

  const [favoriteMakers, setFavoriteMakers] = useState([]);

  useEffect(() => {
    const faves = getFavoriteMakers();
    if (faves) {
      setFavoriteMakers(faves);
    }
  }, getFavoriteMakers());

  const sortedMakers = sortBy(data.allSitePage.nodes, (n) => !favoriteMakers.includes(n.pageContext.maker.id));

  return (
    <Layout>
      <SEO title="" img={'/android-icon-512x512.png'} />
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
        {sortedMakers.map((element) => (
          <li key={element.id} className="flex flex-col">
            <Link
              to={element.path}
              className="block w-full border bg-white pb-4 hover:text-blue-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:text-blue-600"
            >
              <div className="w-full border-b-2 border-slate-300 bg-white dark:border-slate-600">
                <Img fluid={getImg(element.pageContext.maker.id)} className="block" alt={element.pageContext.maker.name} width="500" height="500" />
              </div>
              <div className="text-header">
                <div className="relative flex flex-row px-2 pt-3 font-bold">
                  <div className="w-full px-5 text-center text-sm">{element.pageContext.maker.name}</div>
                  {favoriteMakers.includes(element.pageContext.maker.id) ? (
                    <FontAwesomeIcon
                      id="favStar"
                      className="star-icon m-1 cursor-pointer text-yellow-500"
                      icon={['fas', 'star']}
                      onClick={(e) => {
                        e.preventDefault();
                        const makers = removeFavMaker(element.pageContext.maker.id);
                        setFavoriteMakers(makers);
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      id="favStar"
                      className="star-icon m-1 cursor-pointer text-slate-500"
                      icon={['fas', 'star']}
                      onClick={(e) => {
                        e.preventDefault();
                        const makers = addFavMaker(element.pageContext.maker.id);
                        setFavoriteMakers(makers);
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
