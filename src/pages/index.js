import React, { useState, useEffect } from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';
import Layout from '../layouts/base';
import SEO from '../components/seo';
import { getFavoriteMakers, addFavMaker, removeFavMaker } from '../internal/favorite';
import clsx from 'clsx';

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
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
        {sortedMakers.map((element) => (
          <li key={element.id} className="flex flex-col">
            <Link
              to={element.path}
              className="block w-full overflow-hidden rounded-md border border-slate-600/50 bg-white  transition-colors hover:border-slate-400/80 dark:bg-slate-700 dark:text-slate-200"
            >
              <div className="w-full border-b-2 border-slate-300 bg-white dark:border-slate-600">
                <Img
                  fluid={getImg(element.pageContext.maker.id)}
                  className="block rounded-t-md"
                  alt={element.pageContext.maker.name}
                  width="500"
                  height="500"
                />
              </div>
              <div className="text-header flex items-center justify-between p-4">
                <span className="grow text-center text-lg font-bold">{element.pageContext.maker.name}</span>
                <FontAwesomeIcon
                  id="favStar"
                  className={clsx(
                    'star-icon ml-auto cursor-pointer',
                    favoriteMakers.includes(element.pageContext.maker.id) ? 'text-yellow-500' : 'text-slate-500',
                  )}
                  icon={['fas', 'star']}
                  onClick={(e) => {
                    e.preventDefault();
                    const makers = favoriteMakers.includes(element.pageContext.maker.id)
                      ? removeFavMaker(element.pageContext.maker.id)
                      : addFavMaker(element.pageContext.maker.id);
                    setFavoriteMakers(makers);
                  }}
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default IndexPage;
