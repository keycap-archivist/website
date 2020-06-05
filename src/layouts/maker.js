import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { sortBy } from 'lodash';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ThumbnailImage from '../components/thumbnail-image';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker } = pageContext;

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

  return (
    <Layout>
      <SEO title={maker.name} img={getLogoMaker(maker.id)} />
      <div className="pt-4">
        <Link to="/" className="text-blue-600">
          <FontAwesomeIcon icon={['fas', 'home']} />
        </Link>
      </div>
      <h2 className="text-3xl my-6">
        <span className="font-bold">{maker.name}</span>
      </h2>
      <ul className="flex flex-wrap flex-row list-none -ml-2 -mr-2">
        {sortBy(maker.sculpts, (x) => x.name).map((s) => (
          <li key={s.id} className="flex h-auto w-1/2 md:w-1/4 lg:w-1/5 py-1 px-1">
            <Link
              to={s.link}
              className="
                flex
                flex-col
                justify-between
                max-w-full
                min-w-full
                bg-white
                p-2
                bg-white
                hover:text-blue-600
                shadow-xs
                hover:shadow-md
                pb-4"
            >
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
                <div className="text-sm">{s.name}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Maker;
