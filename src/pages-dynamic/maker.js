import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';

import Layout from '../layouts/base';
import SEO from '../components/seo';
import ThumbnailImage from '../components/thumbnail-image';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker, selfOrder } = pageContext;

  const logos = useStaticQuery(graphql`
    query SeoLogo {
      allFile(filter: { relativePath: { glob: "logos/*" } }) {
        nodes {
          id
          childImageSharp {
            fixed {
              src
              originalName
            }
          }
        }
      }
    }
  `).allFile.nodes;

  const getLogoMaker = (id) => {
    const f = logos.find((x) => x.childImageSharp.fixed.originalName.startsWith(id));
    if (f) {
      return f.childImageSharp.fixed.src;
    }
    return '/android-chrome-512x512.png';
  };
  const sculptList = selfOrder === true ? maker.sculpts : sortBy(maker.sculpts, (x) => x.name);
  return (
    <Layout>
      <SEO title={maker.name} img={getLogoMaker(maker.id)} />
      <div className="pt-4">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
      </div>
      <div className="text-3xl my-6">
        <h2 className="font-bold">{maker.name}</h2>
        {(maker.website || maker.instagram || maker.discord) && (
          <ul className="flex flex-wrap flex-row list-none -ml-1">
            {maker.website && (
              <li className="flex h-auto px-1">
                <a
                  href={maker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={['fas', 'globe']} />
                </a>
              </li>
            )}
            {maker.instagram && (
              <li className="flex h-auto px-1">
                <a
                  href={maker.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={['fab', 'instagram']} />
                </a>
              </li>
            )}
            {maker.discord && (
              <li className="flex h-auto px-1">
                <a
                  href={maker.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl hover:text-blue-600"
                >
                  <FontAwesomeIcon icon={['fab', 'discord']} />
                </a>
              </li>
            )}
            {maker.src && (
              <li className="flex h-auto px-1">
                <a href={maker.src} target="_blank" rel="noopener noreferrer" className="text-xl hover:text-blue-600">
                  <FontAwesomeIcon icon={['fas', 'file']} />
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {sculptList.map((s) => (
          <li key={s.id} className="tile_item">
            <Link to={s.link} className="tile_block">
              <div className="w-full h-full thumbnail-wrapper">
                <ThumbnailImage
                  loading="lazy"
                  src={s.previewImg}
                  className="h-full
                    w-full
                    object-cover"
                  alt={`${maker.name} - ${s.name}`}
                />
              </div>
              <div className="font-bold pt-3 px-2 text-center">
                <div className="title">{s.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
