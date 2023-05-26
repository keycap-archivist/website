import React from 'react';

const Alert = (props) => (
  <>
    <div
      className={`relative w-auto rounded border px-4 py-3 
        bg-${props.color}-100 
        border-${props.color}-400 
        text-${props.color}-700`}
      role="alert"
    >
      <strong className="font-bold">{props.alertMessage}</strong>
      <span className="absolute bottom-0 right-0 top-0 px-4 py-3">
        <svg
          className={`h-6 w-6 fill-current text-${props.color}-500`}
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          onClick={() => {
            props.setAlert(false);
          }}
        >
          <title>Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1
            1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2
            1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>
  </>
);

export default Alert;
