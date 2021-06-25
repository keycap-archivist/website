import React, { useState } from 'react';
import { updateCollection } from '../../internal/collection';
import Modal from '../modal';

const AddToCollectionModal = (props) => {
  const [selectedCollection, setSelectedCollection] = useState(props.collections[0].id);

  const addCapToCollection = () => {
    const collection = props.collections.find((c) => c.id === selectedCollection);
    const { id, name } = props.cap;
    collection.content.items.push({ id, legend: name, prio: false });

    updateCollection(selectedCollection, {
      name: collection.name,
      wishlist: collection.content,
    })
      .then(() => {
        props.setSuccessAlert(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        props.setErrorAlert(true);
      });
  };

  return (
    <Modal modalHeader={props.modalHeader} setModal={props.setModal}>
      <div className="relative p-6 flex content-around">
        <select
          className="border-solid rounded-sm border-2 border-light-blue-500 w-full"
          onChange={(e) => {
            setSelectedCollection(e.target.value);
          }}
        >
          {props.collections.map((collection) => (
            <option value={collection.id} key={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
        <button
          className="mx-2 block w-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 text-xs rounded"
          onClick={() => {
            addCapToCollection();
            props.setModal(false);
          }}
        >
          Add
        </button>
      </div>
    </Modal>
  );
};

export default AddToCollectionModal;
