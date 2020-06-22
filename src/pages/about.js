import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const About = () => (
  <Layout>
    <SEO title="About" />
    <div className="w-full m-auto lg:w-8/12">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="text-justify">
        <strong>Keycap Archivist</strong> is a community driven project for artisan keycap enthusiast for other
        enthusiasts. This is made in collaboration with{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-700"
          href="https://keycap.info/"
        >
          keycap.info
        </a>{' '}
        work; which is the &quot;single source of truth&quot;. The Google Docs from{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-700"
          href="https://keycap.info/"
        >
          keycap.info
        </a>{' '}
        are dowloaded as HTML and parsed to extract the data as the format is the same on every catalog. By then those
        data are exposed throught an open source repository. Once Data is available, couple of things can be made upon
        it; that&lsquo;s how Keycap Archivist was born. If you want to contribute just visit the{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-700"
          href="https://github.com/keycap-archivist/"
        >
          Github
        </a>
        . The project is composed of the following components:
      </p>
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
      <p className="text-justify">
        Database generator is a Javascript based project. Each maker got it&lsquo;s <i>importer</i> module, because even
        if the format is mostly the same there can be some slight differences to handle. All keycap ids are made using a
        CRC32 calculation based on the image url of the keycap.
      </p>
      <p className="text-justify">
        Once the data is collected, it&lsquo;s formated using this json schema and exposed as separated JSON/CSV files
        per maker and one exposing the whole catalog in each format. You can check the compiled database files{' '}
        <a
          href="https://github.com/keycap-archivist/database/tree/master/db"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-700"
        >
          here
        </a>
        . The database is generated every 6 hours and if there is a changed it&lsquo;s pushed to the repository.
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
      <p className="text-justify">
        The app is a NodeJs server using TypeScript and Fastify. It is mainly used to make the Wishlist you can generate
        in{' '}
        <Link to="/wishlist" className="hover:text-blue-700">
          here
        </Link>
        . There is also couple of other features that will be described in the Open Api description (soon LMAO). This is
        the only &quot;costly&quot; feature of the project because it needs a server to run and thankfully a community
        member let us squat its Docker runtime.
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
      <p className="text-justify">
        The website you&lsquo;re browsing right now is made using{' '}
        <a
          href="https://github.com/gatsbyjs/gatsby"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-700"
        >
          Gatsby
        </a>{' '}
        and consuming the database generated like explained before. The website repository polls the database revision
        every 6 hour and check if there is a different revision. If so it&lsquo;s regenerated and pushed on Github
        Pages.
      </p>
      <p className="text-justify mt-6">
        Thanks for taking the time to read this section, if you want to contribute feel free to raise issues on github
        or come discuss with us on{' '}
        <a
          href="https://discord.gg/nXrShaa"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-blue-700"
        >
          discord
        </a>
        !
      </p>
    </div>
  </Layout>
);

export default About;
