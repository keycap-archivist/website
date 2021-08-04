import React, { useState } from 'react';
import { setCollection } from '../../internal/collection';
import Modal from '../modal';

const AddCollectionModal = (props) => {
  const [collectionName, setCollectionName] = useState('');

  const submitCollection = (name) => {
    setCollection({ name, wishlist: { items: [] } })
      .then(() => {
        props.setSuccessAlert(true);
        props.setReload(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        props.setErrorAlert(true);
      });
  };

  return (
    <Modal modalHeader={props.modalHeader} setModal={props.setModal}>
      <div className="relative p-6 flex content-around">
        <input
          className="suggest__input text-black bg-purple-white shadow rounded border-0 p-2 w-full"
          placeholder={props.placeholder}
          onChange={(event) => {
            setCollectionName(event.target.value);
          }}
        />
        <button
          className="mx-2 block w-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 text-xs rounded"
          onClick={() => {
            submitCollection(collectionName);
            props.setModal(false);
          }}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default AddCollectionModal;
