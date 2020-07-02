import React from 'react';
import { Parser } from 'html-to-react';
import Layout from '../components/layout';

const Maker = (data) => {
  const htmlToReactParser = new Parser();
  const content = htmlToReactParser.parse(data.pageContext.content);
  return (
    <Layout>
      <h1>{data.pageContext.title}</h1>
      <div>{content}</div>
    </Layout>
  );
};
export default Maker;
