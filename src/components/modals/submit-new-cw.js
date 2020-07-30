import React, { useState } from 'react';
import Modal from '../modal';

const SubmitNewCwModal = (props) => {
  const [cwName, setCwName] = useState('');

  return (
    <Modal modalHeader="Submit a New Colorway" setModal={props.setModal}>
      <div className="relative p-6 flex content-around">
        <input
          className="suggest__input bg-purple-white shadow rounded border-0 p-2 w-full"
          placeholder="Colorway Name"
          onChange={(event) => {
            setCwName(event.target.value);
          }}
        ></input>
      </div>
    </Modal>
  );
};

export default SubmitNewCwModal;
