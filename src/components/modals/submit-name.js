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
      <div className="relative flex content-around p-6">
        <input
          className="suggest__input bg-purple-white w-full rounded border-0 p-2 shadow"
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
                      rounded
                      bg-green-500
                      px-3
                      py-2
                      text-xs font-bold
                      text-white
                      hover:bg-green-700"
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
