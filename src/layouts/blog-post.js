import React from 'react';
import { Parser } from 'html-to-react';
import Layout from '../components/layout';
import SEO from '../components/seo';

const Maker = (data) => {
  const htmlToReactParser = new Parser();
  const content = htmlToReactParser.parse(data.pageContext.content);
  return (
    <Layout>
      <SEO title={data.pageContext.title} description={data.pageContext.description} />
      <div className="w-full m-auto lg:w-8/12 py-10">
        <h1 className="text-4xl font-bold mb-5">{data.pageContext.title}</h1>
        <div className="space-y-6">{content}</div>
      </div>
    </Layout>
  );
};
export default Maker;
