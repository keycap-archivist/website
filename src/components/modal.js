import React from 'react';

const Modal = (props) => (
  <>
    <div
      className="
            modal
            opacity-100
            ease-out
            justify-center
            items-center
            flex
            overflow-x-hidden
            overflow-y-auto
            fixed
            inset-0
            z-50
            outline-none
            focus:outline-none"
    >
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div
          className="
                opacity-0
                transition-opacity
                opacity-100
                ease-out
                border-0
                rounded-lg
                shadow-lg
                relative
                flex
                flex-col
                w-full
                bg-white
                outline-none
                focus:outline-none"
        >
          <div
            className="
                  flex
                  items-start
                  justify-between
                  p-5 border-b
                  border-solid
                  border-gray-300
                  rounded-t"
          >
            <h3 className="text-2xl font-semibold">{props.modalHeader}</h3>
            <button
              className="
                    p-1
                    ml-auto
                    bg-transparent
                    border-0
                    text-black
                    opacity-5
                    float-right
                    text-3xl
                    leading-none
                    font-semibold
                    outline-none
                    focus:outline-none"
              onClick={() => {
                props.setModal(false);
              }}
            >
              <span
                className="
                      bg-transparent
                      text-black
                      opacity-5
                      h-6
                      w-6
                      text-2xl
                      block
                      outline-none
                      focus:outline-none"
              >
                ×
              </span>
            </button>
          </div>
          <div className="relative p-6 flex content-around">
            <input
              className="suggest__input bg-purple-white shadow rounded border-0 p-2 w-full"
              type="search"
              placeholder="Name"
              onChange={(event) => {
                props.setSuggestionName(event.target.value);
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
                props.submitName(props.colorwayId, props.suggestionName);
                props.setModal(false);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </>
);

export default Modal;
