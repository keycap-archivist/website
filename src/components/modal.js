import React from 'react';

const Modal = (props) => (
  <>
    <div
      className="
            modal
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            overflow-x-hidden
            opacity-100
            outline-none
            ease-out
            focus:outline-none"
    >
      <div className="relative mx-auto my-6 w-auto max-w-3xl">
        <div
          className="
                relative
                flex
                w-full
                flex-col
                rounded-lg
                border-0
                bg-blue_ka
                opacity-0
                opacity-100
                shadow-lg
                outline-none
                transition-opacity
                ease-out
                focus:outline-none"
        >
          <div
            className="
                  flex
                  items-start
                  justify-between
                  rounded-t border-b
                  border-solid
                  border-slate-300
                  p-5"
          >
            <h3 className="text-2xl font-semibold">{props.modalHeader}</h3>
            <button
              className="
                    float-right
                    ml-auto
                    border-0
                    bg-transparent
                    p-1
                    text-3xl
                    font-semibold
                    leading-none
                    text-black
                    opacity-5
                    outline-none
                    focus:outline-none"
              onClick={() => {
                props.setModal(false);
              }}
            >
              <span
                className="
                      block
                      h-6
                      w-6
                      bg-transparent
                      text-2xl
                      text-black
                      opacity-5
                      outline-none
                      focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <div>{props.children}</div>
        </div>
      </div>
    </div>
    <div className="modal-background fixed inset-0 z-40 bg-black opacity-25"></div>
  </>
);

export default Modal;
