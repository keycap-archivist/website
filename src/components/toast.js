import React from 'react';
import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '../internal/twMerge';

const getToastClass = (variant) => {
  switch (variant) {
    case 'success':
      return 'border border-green-200';
    case 'error':
      return 'border border-red-200';
    case 'warning':
      return 'border border-yellow-200';
    default:
      return 'border border-gray-200';
  }
};

const getVariantIcon = (variant) => {
  switch (variant) {
    case 'success':
      return 'check-circle';
    case 'error':
      return 'exclamation-circle';
    case 'warning':
      return 'exclamation-triangle';
    default:
      return 'info-circle';
  }
};

const getVariantIconColor = (variant) => {
  switch (variant) {
    case 'success':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return 'text-slate-400';
  }
};

const ToastWrapper = (props) => (
  <>
    <Toast.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      className={clsx('flex items-center gap-x-3 bg-white dark:bg-slate-900', props.className, getToastClass(props.variant))}
    >
      <FontAwesomeIcon icon={['fas', getVariantIcon(props.variant)]} className={cn(getVariantIconColor(props.variant, 'h-3 w-3'))} />
      <div className="flex grow items-center justify-between">
        <div className="flex flex-col gap-y-2">
          {props.title && <Toast.Title className="font-medium">{props.title}</Toast.Title>}
          <Toast.Description>{props.children}</Toast.Description>
        </div>
        <Toast.Close
          className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400/80 transition-colors hover:bg-slate-200/50 dark:text-slate-500/90 dark:hover:bg-slate-600 dark:hover:text-slate-300"
          aria-label="Close"
        >
          <FontAwesomeIcon icon={['fas', 'xmark']} />
        </Toast.Close>
      </div>
    </Toast.Root>

    <Toast.Viewport className="fixed bottom-0 right-0 z-[9999] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-6 text-sm outline-none" />
  </>
);

export default ToastWrapper;
