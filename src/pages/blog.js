import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import SEO from '../components/seo';

const About = ({ data }) => {
  const { edges: posts } = data.allMarkdownRemark;
  console.log(posts);
  return (
    <Layout>
      <SEO title="Blog" />
      <div className="w-full m-auto lg:w-9/12 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Blog</h1>
        {posts.map((post) => (
          <div key={post.node.id}>
            <h2 className="text-2xl font-bold">
              <Link to={`/${post.node.fields.slug}`}>{post.node.frontmatter.title}</Link>
            </h2>
            <p>{post.node.excerpt}</p>
            <Link className="font-bold float-right" to={`/${post.node.fields.slug}`}>
              More...
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default About;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
