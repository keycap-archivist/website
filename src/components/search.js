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
              id
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
    let countCw = 0;
    for (const m of store) {
      if (countCw === MAX_RESULT) {
        break;
      }
      if (m.context.maker && m.context.maker.name.toLowerCase().indexOf(innerQuery) > -1) {
        if (!out.find((x) => x.type === 'artist' && x.id === m.context.maker.id)) {
          out.push({ type: 'artist', id: m.context.maker.id, title: `${m.context.maker.name}`, url: m.path });
          continue;
        }
      }
      if (m.context.sculpt && m.context.sculpt.name.toLowerCase().indexOf(innerQuery) > -1) {
        if (!out.find((x) => x.type === 'sculpt' && x.id === m.context.sculpt.id)) {
          out.push({
            type: 'sculpt',
            id: m.context.sculpt.id,
            title: `${m.context.maker.name} ${m.context.sculpt.name}`,
            url: `${m.path}`,
          });
          continue;
        }
      }
      if (m.context.sculpt) {
        const f = m.context.sculpt.colorways.find((x) => x.name.toLowerCase().indexOf(innerQuery) > -1);
        if (f) {
          countCw += 1;
          out.push({
            type: 'colorway',
            id: f.id,
            title: `${m.context.maker.name} ${m.context.sculpt.name} ${f.name}`,
            url: `${m.path}/${f.id}`,
          });
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
    const artists = results.filter((x) => x.type === 'artist');
    const sculpts = results.filter((x) => x.type === 'sculpt');
    const cws = results.filter((x) => x.type === 'colorway');
    const output = [];
    if (artists.length) {
      output.push(
        <div className="item-cat-title">
          <span className="item-cat-text">Artists</span>
        </div>,
      );
      output.push(
        ...artists.map((page, i) => (
          <div className="item-search" key={i}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    if (sculpts.length) {
      output.push(
        <div className="item-cat-title">
          <span className="item-cat-text">Sculpts</span>
        </div>,
      );
      output.push(
        ...sculpts.map((page, i) => (
          <div className="item-search" key={i}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    if (cws.length) {
      output.push(
        <div className="item-cat-title">
          <span className="item-cat-text">Colorways</span>
        </div>,
      );
      output.push(
        ...cws.map((page, i) => (
          <div className="item-search" key={i}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    return output;
  };

  return (
    <>
      <div className="w-full mr-6">
        <input
          className="search__input bg-purple-white shadow rounded border-0 p-2 w-full"
          type="search"
          onChange={handleChange}
          placeholder={'Search'}
          value={query}
        />
        {results.length ? (
          <div className="search__list">
            <ResultList />
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default Search;
