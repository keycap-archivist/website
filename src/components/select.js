import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={clsx(
      'flex h-10 w-full items-center justify-between rounded-md border border-slate-300/90 bg-white px-3 py-2 text-sm  ring-offset-slate-100 placeholder:text-slate-600/50 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300 dark:placeholder:text-slate-300/50',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <FontAwesomeIcon icon={['fa', 'chevron-down']} className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={clsx(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-slate-800 shadow-md animate-in fade-in-80 dark:border-slate-700/90 dark:bg-slate-700 dark:text-slate-300',
        position === 'popper' && 'translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={clsx('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={clsx('py-1.5 pl-8 pr-2 text-sm font-semibold', className)} {...props} />
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={clsx(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-indigo-400/5 focus:text-indigo-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-indigo-200/5 dark:focus:text-indigo-200',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <FontAwesomeIcon icon={['fa', 'check']} className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={clsx('-mx-1 my-1 h-px bg-slate-100', className)} {...props} />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator };
