import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil, sortBy, join } from 'lodash';
import ReactCountryFlag from 'react-country-flag';

import Layout from '../layouts/base';
import SEO from '../components/seo';

// eslint-disable-next-line
import AClogo from '-!svg-react-loader?name=AClogo!../assets/img/svg/ac-logo.inline.svg';
import { getImage } from 'gatsby-plugin-image';
import ThumbnailImage from '../components/thumbnail-image';

const Maker = (props) => {
  const { pageContext } = props;
  const { maker, selfOrder } = pageContext;

  const LogoAndBanner = useStaticQuery(graphql`
    query LogoAndBanner {
      logos: allFile(filter: { relativePath: { glob: "logos/*" } }) {
        nodes {
          id
          childImageSharp {
            gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED, formats: [WEBP], width: 500)
          }
          relativePath
        }
      }
    }
  `);

  const getLogoMaker = (id) => {
    const f = LogoAndBanner.logos.nodes.find((x) => x.relativePath.includes(id));
    console.log(f);
    if (!isNil(f)) {
      return getImage(f);
    }
    return '/android-chrome-512x512.png';
  };

  const sculptList = selfOrder === true ? maker.sculpts : sortBy(maker.sculpts, (x) => x.name);
  console.log(sculptList);

  return (
    <Layout>
      <SEO title={maker.name} img={getLogoMaker(maker.id).src} />
      <div className="mt-6">
        {[
          {
            label: 'Home',
            link: '/',
          },
        ].map((x) => (
          <>
            <Link
              to={x.link}
              className="text-sm font-medium text-slate-900/60 underline transition-colors hover:text-slate-800/60 dark:text-slate-50/80 dark:hover:text-white/90"
            >
              {x.label}
            </Link>{' '}
            /{' '}
          </>
        ))}
      </div>
      <div className="my-6 flex items-center justify-between">
        <div className="flex items-center gap-x-4 text-2xl">
          <h2 className="font-bold">{maker.name}</h2>
          {maker.nationality && (
            <ReactCountryFlag
              className="emojiFlag"
              countryCode={`${maker.nationality.toUpperCase()}`}
              style={{
                fontSize: '1em',
                lineHeight: '1em',
              }}
              svg
            />
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <span>External links :</span>
          {(maker.website || maker.instagram || maker.discord) && (
            <ul className="-ml-1 flex list-none flex-row flex-wrap">
              {maker.artisanCollector && (
                <li className="flex h-auto px-1">
                  <a
                    href={maker.artisanCollector}
                    title="Artisan Collector"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                  >
                    <AClogo className="svg-inline--fa fa-w-16" />
                  </a>
                </li>
              )}
              {maker.website && (
                <li className="flex h-auto px-1">
                  <a
                    href={maker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
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
                    className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
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
                    className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                  >
                    <FontAwesomeIcon icon={['fab', 'discord']} />
                  </a>
                </li>
              )}
              {maker.src && (
                <li className="flex h-auto px-1">
                  <a
                    href={maker.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-slate-900/80 transition-colors hover:text-slate-900/100 dark:text-white/80 dark:hover:text-white/100"
                  >
                    <FontAwesomeIcon icon={['fas', 'file']} />
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
        {sculptList.map((s) => (
          <li key={s.id} className="flex flex-col">
            <Link
              to={s.link}
              className="block w-full overflow-hidden rounded-md bg-white shadow-md transition hover:border-slate-400/80 hover:shadow-lg dark:border dark:border-slate-600/50 dark:bg-slate-700 dark:text-slate-200 dark:shadow-none"
            >
              <div className="h-[250px] border-b border-slate-200 bg-white dark:border-b-2 dark:border-slate-600">
                <ThumbnailImage src={s.previewImg} className="h-full w-full object-cover" alt={`${maker.name} - ${s.name}`} />
              </div>
              <div className="p-4 text-center font-bold">
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
