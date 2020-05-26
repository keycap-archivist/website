/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

const MAX_RESULT = 20;

const Search = () => {
  const [showResult, setShowResult] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(undefined);

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
              id
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
      if (m.context.maker && m.context.maker.name.toLowerCase().indexOf(innerQuery) > -1) {
        if (!out.find((x) => x.type === 'artist' && x.id === m.context.maker.id)) {
          out.push({ type: 'artist', id: m.context.maker.id, title: `${m.context.maker.name}`, url: m.path });
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
        }
      }
      if (m.context.sculpt && countCw !== MAX_RESULT) {
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

  const searchForResults = (currentQuery) => {
    const r = getSearchResults(currentQuery);
    setResults(r);
    if (r.length) {
      setShowResult(true);
    } else {
      setShowResult(false);
    }
  };

  const handleChange = (event) => {
    const currentQuery = event.target.value;
    setQuery(event.target.value);

    clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(searchForResults, 400, currentQuery));
  };

  const ResultList = () => {
    const artists = results.filter((x) => x.type === 'artist');
    const sculpts = results.filter((x) => x.type === 'sculpt');
    const cws = results.filter((x) => x.type === 'colorway');
    const output = [];
    if (artists.length) {
      output.push(
        <div className="item-cat-title" key={'maker-title'}>
          <span className="item-cat-text">Artists</span>
        </div>,
      );
      output.push(
        ...artists.map((page, i) => (
          <div className="item-search" key={`maker-${i}`}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    if (sculpts.length) {
      output.push(
        <div className="item-cat-title" key={'sculpt-title'}>
          <span className="item-cat-text">Sculpts</span>
        </div>,
      );
      output.push(
        ...sculpts.map((page, i) => (
          <div className="item-search" key={`sculpt-${i}`}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    if (cws.length) {
      output.push(
        <div className="item-cat-title" key={'cw-title'}>
          <span className="item-cat-text">Colorways</span>
        </div>,
      );
      output.push(
        ...cws.map((page, i) => (
          <div className="item-search" key={`cw-${i}`}>
            <Link to={page.url} className="link">
              <h4>{page.title}</h4>
            </Link>
          </div>
        )),
      );
    }
    return output;
  };

  const onFocus = () => {
    if (results.length) {
      setShowResult(true);
    }
  };

  const onBlur = () => {
    setShowResult(false);
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
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {showResult ? (
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
