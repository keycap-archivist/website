import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Loading = () => (
  <>
    <button className="mx-2 block w-35 bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 py-2 px-3 text-xs rounded">
      <FontAwesomeIcon className="animate-spin" icon={['fa', 'spinner']} /> Loading
    </button>
  </>
);

export default Loading;
