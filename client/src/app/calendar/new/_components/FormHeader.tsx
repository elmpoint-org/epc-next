import { useEffect } from 'react';

import { MenuButton } from '@headlessui/react';
import { ActionIcon } from '@mantine/core';
import {
  IconDotsVertical,
  IconFiles,
  IconSeparatorVertical,
  IconTrash,
} from '@tabler/icons-react';

import { useFormCtx } from '../state/formCtx';
import { useFormActions } from './FormActions';
import {
  Dropdown,
  DropdownItems,
  DropdownOption,
} from '@/app/_components/_base/Dropdown';

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

          <Dropdown>
            {/* dropdown button */}
            <div className="t">
              <ActionIcon component={MenuButton} variant="subtle" color="slate">
                <IconDotsVertical />
              </ActionIcon>
            </div>

            {/* dropdown menu */}
            <DropdownItems>
              <div className="py-1">
                <DropdownOption
                  icon={IconSeparatorVertical}
                  onClick={() => runAction('SPLIT')}
                >
                  Split&hellip;
                </DropdownOption>
                <DropdownOption
                  icon={IconFiles}
                  onClick={() => runAction('DUPLICATE')}
                >
                  Duplicate
                </DropdownOption>
              </div>

              <div className="py-1">
                <DropdownOption
                  icon={IconTrash}
                  onClick={() => runAction('DELETE')}
                >
                  Delete&hellip;
                </DropdownOption>
              </div>

              <RestoreScroll />
            </DropdownItems>
          </Dropdown>
        </div>
      )}
    </>
  );
}

// ----------------------------------------

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
