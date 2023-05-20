import React from 'react';

const ConfirmDialogModal = (props) => (
  <div className="relative mt-6 flex flex-col justify-between gap-6">
    <div className="grow">
      <label>{props.placeholder}</label>
    </div>
    <div className="flex items-center self-end gap-x-3">
      <button
        className="inline-flex items-center justify-center self-end rounded bg-red-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-red-600"
        onClick={() => {
          props.setModal(false);
        }}
      >
        Cancel
      </button>
      <button
        className="inline-flex items-center justify-center self-end rounded bg-green-500 px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-green-600"
        onClick={() => {
          props.onModalConfirm();
          props.setModal(false);
        }}
      >
        Confirm
      </button>
    </div>
  </div>
);

export default ConfirmDialogModal;
