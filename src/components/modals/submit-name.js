import React, { useState } from 'react';
import cn from '../../internal/twMerge';

const SubmitNameModal = (props) => {
  const [suggestionName, setSuggestionName] = useState('');

  const submitName = (clwId, clwName) => {
    fetch('https://app.keycap-archivist.com/api/v2/submitName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: clwId, name: clwName }),
    }).catch((error) => {
      console.error('Error:', error);
      props.setErrorAlert(true);
    });

    props.setSuccessAlert(true);
  };

  return (
    <div className="relative mt-6 flex flex-col justify-between gap-6">
      <input
        className={cn(
          'grow rounded-md border-gray-300/90 p-2 text-slate-600',
          'placeholder:text-sm placeholder:font-medium placeholder:text-slate-600/50',
          'focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
          'hover:border-gray-300/100',
          'dark:border-gray-700/90 dark:bg-slate-700 dark:text-slate-300',
          'dark:placeholder:text-slate-300/50',
          'dark:hover:border-gray-700/100',
        )}
        placeholder={props.placeholder}
        type="text"
        onChange={(event) => {
          setSuggestionName(event.target.value);
        }}
      />
      <button
        className="flex items-center justify-center self-end rounded bg-green-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700"
        onClick={() => {
          submitName(props.clwId, suggestionName);
          props.setModal(false);
        }}
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitNameModal;
