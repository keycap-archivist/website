import React, { useState, useRef } from 'react';
import Modal from '../modal';

const SubmitNewCwModal = (props) => {
  const [cwName, setCwName] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);

  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    setFileUploaded(true);
    setUploadedPhoto(event.target.files[0]);
  };

  const submitForm = (maker, sculpt, cw, photo) => {
    const formData = new FormData();
    formData.append('file', photo);
    formData.append('maker', maker);
    formData.append('sculpt', sculpt);
    formData.append('colorway', cw);

    fetch('https://app.keycap-archivist.com/api/v2/submission', {
      method: 'POST',
      body: formData,
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
    <Modal modalHeader="Submit a New Colorway" setModal={props.setModal}>
      <div className="relative p-6 flex content-around">
        <button
          className={`
            mr-3
            block
            w-20
            bg-indigo-500
            hover:bg-indigo-700
            text-white
            font-bold
            py-2 px-3
            text-xs
            rounded
            ${fileUploaded && 'cursor-not-allowed opacity-50'}
            `}
          onClick={handleClick}
          disabled={fileUploaded}
        >
          {fileUploaded ? 'Photo Uploaded' : 'Upload Photo'}
        </button>
        <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
        <input
          className="suggest__input text-black bg-purple-white shadow rounded border-0 p-2 w-full"
          placeholder="Colorway Name"
          onChange={(event) => {
            setCwName(event.target.value);
          }}
        ></input>
        <button
          className="
          ml-3
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
            submitForm(props.maker, props.sculpt, cwName, uploadedPhoto);
            props.setModal(false);
          }}
        >
          Submit
        </button>
      </div>
    </Modal>
  );
};

export default SubmitNewCwModal;
