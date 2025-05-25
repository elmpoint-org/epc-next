import { forwardRef, type JSX } from 'react';
import { Menu, MenuItem, MenuItems } from '@headlessui/react';

import { clmx } from '@/util/classConcat';
import { IconType } from '@/util/iconType';

export const Dropdown = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Menu>
>(({ className, ...props }, ref) => {
  return (
    <Menu
      ref={ref}
      as="div"
      className={clmx('relative inline-block text-left', className)}
      {...props}
    />
  );
});
Dropdown.displayName = 'Dropdown';

export const DropdownItems = forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof MenuItems>
>(({ className, ...props }, ref) => {
  return (
    <MenuItems
      ref={ref}
      transition
      className={clmx(
        'absolute right-0 z-10 mt-2 flex w-56 flex-col divide-y divide-slate-200 rounded-md bg-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
        /* transition */ 'origin-top-right transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in',

        className,
      )}
      {...props}
    />
  );
});
DropdownItems.displayName = 'DropdownItems';

export function DropdownOption({
  icon: Icon,
  className,
  children,
  ...props
}: { icon: IconType } & JSX.IntrinsicElements['button']) {
  return (
    <MenuItem>
      <button
        className={clmx(
          'group flex w-full items-center px-4 py-2 text-sm text-slate-700 data-[focus]:bg-slate-200 data-[focus]:text-slate-900',
          className,
        )}
        {...props}
      >
        <Icon
          aria-hidden="true"
          className="mr-3 size-5 text-slate-400 group-hover:text-slate-500"
        />
        {children}
      </button>
    </MenuItem>
  );
}
