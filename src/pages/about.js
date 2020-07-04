import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { DBREV } from 'gatsby-env-variables';

import Layout from '../components/layout';
import SEO from '../components/seo';

const About = () => {
  const { siteBuildMetadata } = useStaticQuery(
    graphql`
      query {
        siteBuildMetadata {
          buildTime
        }
      }
    `,
  );
  return (
    <Layout>
      <SEO title="About" />
      <div className="w-full m-auto lg:w-8/12 py-10">
        <h1 className="text-3xl font-bold">About</h1>
        <p className="my-5">
          <strong>Keycap Archivist</strong> is a community driven project from artisan keycap enthusiasts made for other
          enthusiasts. It is made in collaboration with{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
            href="https://keycap.info/"
          >
            keycap.info
          </a>
          , which is the &quot;single source of truth&quot;. The Google Docs from{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
            href="https://keycap.info/"
          >
            keycap.info
          </a>{' '}
          are dowloaded as HTML and parsed to extract the data as the format is the same on every catalog. Then those
          data are exposed through an open source repository. Once data is available, we build upon it; that&lsquo;s how{' '}
          <strong>Keycap Archivist</strong> was born. If you want to contribute just visit the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
            href="https://github.com/keycap-archivist/"
          >
            Github
          </a>
          .
        </p>
        <p className="my-5">The project is composed of the following components:</p>
        <h2 className="text-2xl font-bold">
          Database{' '}
          <a
            href="https://github.com/keycap-archivist/database"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 text-xl"
          >
            <FontAwesomeIcon icon={['fab', 'github']} />
          </a>
        </h2>
        <p className="my-5">
          Database generator is a Javascript based project. Each maker got it&lsquo;s importer and parser module,
          because even if the format is mostly the same there can be some slight differences to handle. All keycap ids
          are made using a CRC32 calculation based on the image url of the keycap.
        </p>
        <p className="my-5">
          Once the data is collected, it&lsquo;s formated using this json schema and exposed as separated JSON/CSV files
          per maker and one exposing the whole catalog in each format. You can check the compiled database files{' '}
          <a
            href="https://github.com/keycap-archivist/database/tree/master/db"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
          >
            here
          </a>
          . The database is generated every 6 hours and if there is a change it&lsquo;s pushed to the repository.
        </p>
        <h2 className="text-2xl font-bold">
          App{' '}
          <a
            href="https://github.com/keycap-archivist/app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 text-xl"
          >
            <FontAwesomeIcon icon={['fab', 'github']} />
          </a>
        </h2>
        <p className="my-5">
          The app is a NodeJs server using TypeScript and Fastify. It is mainly used to make the Wishlist you can
          generate in{' '}
          <Link to="/wishlist" className="font-bold text-blue-700 hover:underline">
            here
          </Link>
          . There is also couple of other features that will be described in the Open Api description (soon LMAO). This
          is the only &quot;costly&quot; feature of the project because it needs a server to run and thankfully a
          community member let us squat its Docker runtime.
        </p>
        <h2 className="text-2xl font-bold">
          Website{' '}
          <a
            href="https://github.com/keycap-archivist/website"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700 text-xl"
          >
            <FontAwesomeIcon icon={['fab', 'github']} />
          </a>
        </h2>
        <p className="my-5">
          The website you&lsquo;re browsing right now is made using{' '}
          <a
            href="https://github.com/gatsbyjs/gatsby"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
          >
            Gatsby
          </a>{' '}
          and consuming the database generated like explained before. The website repository polls the database revision
          every 6 hour and check if there is a different revision. If so it&lsquo;s regenerated and pushed on Github
          Pages.
        </p>
        <p className="my-5">
          Thanks for taking the time to read this section, if you want to contribute feel free to raise issues on github
          or come discuss with us on{' '}
          <a
            href="https://discord.gg/nXrShaa"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-700 hover:underline"
          >
            discord
          </a>
          !
        </p>
        <div className="text-xs">
          <h3>Build Info</h3>
          <ul>
            <li>dbrevision: {DBREV}</li>
            <li>Build date: {siteBuildMetadata.buildTime.slice(0, 19)}</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
export default About;
