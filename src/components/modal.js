import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Modal = (props) => (
  <Dialog.Root open={props.open} onOpenChange={props.setOpen}>
    <Dialog.Trigger asChild>
      <button className="inline-flex items-center justify-center rounded-md bg-pink-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-pink-700">
        {props.buttonTitle}
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50 bg-black/80" />
      <Dialog.Content className="dialog-content z-[60] fixed left-1/2 top-1/2 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-md focus:outline-none dark:bg-slate-800 sm:max-w-[450px]">
        <Dialog.Title className="m-0 font-medium">{props.modalTitle}</Dialog.Title>
        <Dialog.Description>{props.children}</Dialog.Description>
        <Dialog.Close
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400/80 dark:text-slate-700/90 transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-600"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={['fas', 'xmark']} />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
