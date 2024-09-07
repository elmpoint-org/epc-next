import { useEffect } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import {
  IconDotsVertical,
  IconFiles,
  IconSeparatorVertical,
  IconTrash,
} from '@tabler/icons-react';

import { IconType } from '@/util/iconType';
import { clmx, clx } from '@/util/classConcat';
import { useFormCtx } from '../state/formCtx';
import { useFormActions } from './FormActions';

export default function FormHeader() {
  const { eventText, updateId } = useFormCtx();

  const runAction = useFormActions();

  return (
    <>
      {updateId && (
        <div className="mb-2 flex flex-row">
          <div className="flex-1 text-xl">
            <span className="select-none text-slate-400">Edit: </span>
            <span>{eventText.title}</span>
          </div>

          <Menu as="div" className="relative inline-block text-left">
            {/* dropdown button */}
            <div className="t">
              <ActionIcon component={MenuButton} variant="subtle" color="slate">
                <IconDotsVertical />
              </ActionIcon>
            </div>

            {/* dropdown menu */}
            <MenuItems
              transition
              className={clx(
                'absolute right-0 z-10 mt-2 flex w-56 flex-col divide-y divide-slate-200 rounded-md bg-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                /* transition */ 'origin-top-right transition data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in',
              )}
            >
              <div className="py-1">
                <Option
                  icon={IconSeparatorVertical}
                  onClick={() => runAction('SPLIT')}
                >
                  Split
                </Option>
                <Option icon={IconFiles} onClick={() => runAction('DUPLICATE')}>
                  Duplicate
                </Option>
              </div>

              <div className="py-1">
                <Option icon={IconTrash} onClick={() => runAction('DELETE')}>
                  Delete
                </Option>
              </div>

              <RestoreScroll />
            </MenuItems>
          </Menu>
        </div>
      )}
    </>
  );
}

// ----------------------------------------

function Option({
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

function RestoreScroll() {
  useEffect(() => {
    const cb = () =>
      setTimeout(() => {
        document.documentElement.style.overflow = 'unset';
        document.documentElement.style.padding = '0';
      });
    cb();
    return () => {
      cb();
    };
  }, []);

  return <></>;
}
