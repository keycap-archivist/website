import React from 'react';

import Layout from '../components/layout';

const Maker = (props) => {
  const { pageContext } = props;
  const { sculpt } = pageContext;
  return (
    <Layout>
      <h1>{sculpt.name}</h1>
      <ul>
        {sculpt.colorways.map((c) => {
          return (
            <li key={c.id}>
              {c.name}
              <img style={{ maxWidth: '250px' }} src={c.img} />
            </li>
          );
        })}
      </ul>
    </Layout>
  );
};

export default Maker;
