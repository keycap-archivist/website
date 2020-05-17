/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

const MAX_RESULT = 20;

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const store = useStaticQuery(graphql`
    query localSearch {
      allSitePage(filter: { context: { type: { in: ["maker", "sculpt"] } } }) {
        nodes {
          context {
            sculpt {
              colorways {
                name
                id
              }
              name
            }
            maker {
              name
            }
            type
          }
          path
          id
        }
      }
    }
  `).allSitePage.nodes;

  const getSearchResults = (q) => {
    if (q.length < 2) {
      return [];
    }
    const innerQuery = q.toLowerCase();
    const out = [];
    for (const m of store) {
      if (out.length === MAX_RESULT) {
        break;
      }
      if (
        m.context.maker &&
        m.context.maker.name.toLowerCase().indexOf(innerQuery) > -1
      ) {
        out.push({ title: `Artist ${m.context.maker.name}`, url: m.path });
        continue;
      }
      if (
        m.context.sculpt &&
        m.context.sculpt.name.toLowerCase().indexOf(innerQuery) > -1
      ) {
        out.push({
          title: `Sculpt ${m.context.sculpt.name}`,
          url: `${m.path}#${m.id}`,
        });
        continue;
      }
      if (m.context.sculpt) {
        const f = m.context.sculpt.colorways.find(
          (x) => x.name.toLowerCase().indexOf(innerQuery) > -1,
        );
        if (f) {
          out.push({ title: `Colorway ${f.name}`, url: `${m.path}#${f.id}` });
        }
      }
    }
    return out;
  };

  const handleChange = (event) => {
    const currentQuery = event.target.value;
    setQuery(event.target.value);
    const r = getSearchResults(currentQuery);
    setResults(r);
  };

  const ResultList = () => {
    if (results.length > 0) {
      return results.map((page, i) => (
        <div className="item-search" key={i}>
          <Link to={page.url} className="link">
            <h4>{page.title}</h4>
          </Link>
        </div>
      ));
    }
    if (query.length > 2) {
      return `No results for ${query}`;
    }
    if (results.length === 0 && query.length > 0) {
      return 'Please insert at least 3 characters';
    }
    return '';
  };

  return (
    <div>
      <input
        className="search__input"
        type="text"
        onChange={handleChange}
        placeholder={'Search'}
        value={query}
      />
      <div className="search__list">
        <ResultList />
      </div>
    </div>
  );
};

export default Search;
