/* eslint-disable operator-linebreak */
/* eslint-disable no-continue */
import React, { useState } from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { quickScore } from 'quick-score';
import { uniqBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const MAX_CW_RESULT = 20;
const MAX_SCULPT_RESULT = 10;
const MAX_MAKER_RESULT = 5;

const SearchResultsCategory = ({ title }) => (
  <div className="mb-2 border-b-2 border-slate-400 pb-1 pt-2 first:pt-0 dark:border-slate-600">
    <span className="text-xs font-bold uppercase text-slate-400 dark:text-slate-600">{title}</span>
  </div>
);

const SearchResultsLink = ({ title, url }) => (
  <div className="rounded p-2 text-slate-800 transition-colors hover:bg-slate-200/40 dark:text-slate-300 dark:hover:bg-slate-500/50 dark:hover:text-white">
    <Link to={url} className="text-sm">
      <h4>{title}</h4>
    </Link>
  </div>
);

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
    const artists = results.filter((x) => x.type === 'artist');
    const sculpts = results.filter((x) => x.type === 'sculpt');
    const cws = results.filter((x) => x.type === 'colorway');
    const output = [];

    if (artists.length) {
      output.push(<SearchResultsCategory title={'Artists'} key={'maker-title'} />);
      output.push(...artists.map((page, i) => <SearchResultsLink title={page.title} url={page.url} key={`maker-${i}`} />));
    }

    if (sculpts.length) {
      output.push(<SearchResultsCategory title={'Sculpts'} key={'sculpt-title'} />);
      output.push(...sculpts.map((page, i) => <SearchResultsLink title={page.title} url={page.url} key={`sculpt-${i}`} />));
    }

    if (cws.length) {
      output.push(<SearchResultsCategory title={'Colorways'} key={'cw-title'} />);
      output.push(...cws.map((page, i) => <SearchResultsLink title={page.title} url={page.url} key={`cw-${i}`} />));
    }

    return output;
  };

  const onFocus = () => {
    if (results.length) {
      setShowResult(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <label className="relative block w-[210px] items-center text-sm text-slate-600 shadow-sm transition focus-within:text-indigo-300 dark:text-slate-300 sm:w-[260px] md:w-full">
        <FontAwesomeIcon icon={faSearch} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 transform text-opacity-75" />
        <input
          className="w-[210px] rounded-md border-slate-300/90 pl-9 text-slate-600 placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 hover:border-slate-300/100 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50 dark:hover:border-slate-700/100 sm:w-[260px] md:w-full"
          type="search"
          onChange={handleChange}
          placeholder={'Search'}
          value={query}
          onFocus={onFocus}
        />
      </label>
      {showResult ? (
        <div className="absolute z-10 mt-16 max-h-[60vh] w-[90vw] overflow-y-scroll rounded-md bg-white p-6 shadow scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 dark:bg-slate-800 dark:scrollbar-thumb-slate-600 md:mt-16 lg:w-[600px]">
          <ResultList />
        </div>
      ) : null}
    </div>
  );
};

export default Search;
