import React from 'react';
import Modal from '../modal';

const ConfirmDialogModal = (props) => (
  <Modal modalHeader={props.modalHeader} setModal={props.setModal}>
    <div className="relative flex content-around bg-blue_ka p-6">
      <div className="w-full pr-2">
        <label>{props.placeholder}</label>
      </div>
      <div className="mt-2 flex flex-wrap">
        <div className="justify-right flex w-1/3 pr-2">
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
              props.onModalConfirm();
              props.setModal(false);
            }}
          >
            Okey
          </button>
        </div>
        <div className="justify-right ml-8 flex w-1/3 pr-2">
          <button
            className="
                      mx-2
                      block
                      w-20
                      rounded
                      bg-red-500
                      px-3
                      py-2
                      text-xs font-bold
                      text-white
                      hover:bg-red-700"
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
