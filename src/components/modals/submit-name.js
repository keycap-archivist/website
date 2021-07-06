import React, { useState } from 'react';
import Modal from '../modal';

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
    <Modal modalHeader={props.modalHeader} setModal={props.setModal}>
      <div className="relative p-6 flex content-around">
        <input
          className="suggest__input text-black bg-purple-white shadow rounded border-0 p-2 w-full"
          placeholder={props.placeholder}
          onChange={(event) => {
            setSuggestionName(event.target.value);
          }}
        ></input>
        <button
          className="
                      mx-2
                      block
                      w-20
                      bg-green-500
                      hover:bg-green-700
                      text-white
                      font-bold
                      py-2 px-3
                      text-xs
                      rounded"
          onClick={() => {
            submitName(props.clwId, suggestionName);
            props.setModal(false);
          }}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default SubmitNameModal;
