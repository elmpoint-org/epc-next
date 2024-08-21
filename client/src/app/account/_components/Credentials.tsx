'use client';

import { ActionIcon, Collapse, ScrollArea } from '@mantine/core';
import {
  IconChevronDown,
  IconPlus,
} from '@tabler/icons-react';

import { useUserData } from '../_ctx/userData';

import { Credential } from './Credential';
import NewPasskey from './NewPasskey';
import { useDisclosure } from '@mantine/hooks';

export default function Credentials() {
  const user = useUserData();

  const [isOpen, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-md bg-slate-200 p-4">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-lg">Your passkeys</h3>

            <ActionIcon color="slate" variant="subtle" onClick={toggle}>
              {isOpen ? <IconChevronDown /> : <IconPlus />}
            </ActionIcon>
          </div>

          <div className="-mb-2">
            <ScrollArea
              scrollbars="x"
              scrollHideDelay={200}
              offsetScrollbars="x"
              classNames={{
                scrollbar: '!bg-transparent',
              }}
            >
              <div className="flex flex-row gap-2 p-2">
                {user ? (
                  user.credentials?.length ? (
                    <>
                      {user.credentials?.map((it, i) => (
                        <Credential key={it.id} credential={it} />
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="p-4 text-sm italic text-slate-500">
                        no passkeys found.
                      </div>
                    </>
                  )
                ) : (
                  <>
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Credential key={i} order={i} />
                      ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Collapse in={isOpen}>
          <NewPasskey onClose={close} />
        </Collapse>
      </div>
    </>
  );
}
