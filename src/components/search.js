/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { quickScore } from 'quick-score';
import { uniqBy } from 'lodash';

const MAX_CW_RESULT = 20;
const MAX_SCULPT_RESULT = 10;
const MAX_MAKER_RESULT = 5;

const Search = () => {
  const [showResult, setShowResult] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(undefined);

  const store = useStaticQuery(graphql`
    query localSearch {
      allSitePage(filter: { id: { glob: "SitePage /maker/*/*" } }) {
        nodes {
          pageContext
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
    const innerQuery = q.toLowerCase().trim();
    const out = [];
    const cwResults = [];
    for (const m of store) {
      cwResults.push(
        ...m.pageContext.sculpt.colorways.map((x) => {
          const titleTest = `${m.pageContext.maker.name} ${m.pageContext.sculpt.name} ${x.name}`.toLowerCase();
          const titleDisplay = `${m.pageContext.maker.name} ${m.pageContext.sculpt.name} ${x.name}`;
          return {
            type: 'colorway',
            sculpt: m.pageContext.sculpt,
            maker: m.pageContext.maker,
            id: x.id,
            title: titleDisplay,
            score: quickScore(titleTest, innerQuery),
            sculptUrl: `${m.path}`,
            url: `${m.path}${x.id}`,
          };
        }),
      );
    }

    const preResult = cwResults
      .filter((x) => x.score !== 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_CW_RESULT);
    out.push(...preResult);

    const sculpts = uniqBy(
      [
        ...preResult.map((x) => ({
          url: x.sculptUrl,
          type: 'sculpt',
          title: `${x.maker.name} ${x.sculpt.name}`,
          id: x.sculpt.id,
          sculpt: x.sculpt,
        })),
      ],
      (x) => x.id,
    );
    out.push(...sculpts.slice(0, MAX_SCULPT_RESULT));

    const artists = uniqBy(
      [
        ...preResult.map((x) => {
          const arrUrl = x.sculptUrl.split('/');
          return {
            url: `${arrUrl.slice(0, arrUrl.length - 2).join('/')}`,
            type: 'artist',
            title: x.maker.name,
            id: x.maker.id,
            sculpt: x.sculpt,
          };
        }),
      ],
      (x) => x.id,
    );
    out.push(...artists.slice(0, MAX_MAKER_RESULT));

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
    if (!currentQuery) {
      searchForResults(currentQuery);
    } else {
      clearTimeout(searchTimeout);
      setSearchTimeout(setTimeout(searchForResults, 400, currentQuery));
    }
  };

  const ResultList = () => {
    // TODO: add beeautifull scrollbar
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

  return (
    <div className="mr-6 w-full">
      <input
        className="bg-purple-white w-full rounded border-0 p-2 text-gray-900 shadow"
        type="search"
        onChange={handleChange}
        placeholder={'Search'}
        value={query}
        onFocus={onFocus}
      />
      {showResult ? (
        <div className="absolute z-10 mr-3 mt-3 max-h-[75vh] overflow-y-scroll rounded bg-white p-3 shadow dark:bg-gray-800">
          <ResultList />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Search;
