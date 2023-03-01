import React from 'react';
import Modal from '../modal';

const ConfirmDialogModal = (props) => (
  <Modal modalHeader={props.modalHeader} setModal={props.setModal}>
    <div className="bg-blue_ka relative p-6 flex content-around">
      <div className="w-full pr-2">
        <label>{props.placeholder}</label>
      </div>
      <div className="flex flex-wrap mt-2">
        <div className="w-1/3 pr-2 flex justify-right">
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
              props.onModalConfirm();
              props.setModal(false);
            }}
          >
            Okey
          </button>
        </div>
        <div className="w-1/3 ml-8 pr-2 flex justify-right">
          <button
            className="
                      mx-2
                      block
                      w-20
                      bg-red-500
                      hover:bg-red-700
                      text-white
                      font-bold
                      py-2 px-3
                      text-xs
                      rounded"
            onClick={() => {
              props.setModal(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialogModal;
