'use client';

import { useEffect, useState } from 'react';

import { Dialog, DialogPanel } from '@headlessui/react';
import { ActionIcon, ScrollArea } from '@mantine/core';
import { useDisclosure, useToggle } from '@mantine/hooks';
import {
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconMinus,
  IconPlus,
  IconSquare,
  IconX,
} from '@tabler/icons-react';

import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';

import NewEventForm from '../new/_components/NewEventForm';
import { clx } from '@/util/classConcat';

import { motion } from 'framer-motion';

const PANEL_NAME = 'Add your stay';

// COMPONENT
export default function NewStayDialog({ trigger }: { trigger: ReverseCbProp }) {
  const [isOpen, { open, close }] = useDisclosure();
  useReverseCb(trigger, open);

  // panel state
  const [side, setSide] = useToggle(['RIGHT', 'LEFT'] as const);
  const [minimized, setMinimized] = useState(false);

  function safeClose() {
    if (!minimized) return setMinimized(true);
    close();
  }
  useEffect(() => {
    if (!isOpen) return;
    setMinimized(false);
    setTimeout(() => {
      document.documentElement.style.overflow = 'unset';
      document.documentElement.style.padding = '0';
    });
  }, [isOpen]);

  return (
    <>
      <Dialog open={isOpen} onClose={safeClose}>
        {/* frame */}
        <div
          className={clx(
            'group fixed inset-2 z-[200] flex flex-row items-end sm:inset-6',
            side === 'LEFT' && 'justify-start',
            side === 'RIGHT' && 'justify-end',
          )}
          data-m={minimized || null}
        >
          {/* panel */}
          <motion.div
            layout
            className="flex h-full w-[48rem] max-w-screen-sm flex-col justify-end group-data-[m]:w-96"
          >
            <DialogPanel
              transition
              className={clx(
                'flex max-h-full w-full flex-col overflow-hidden rounded-xl border border-slate-300 bg-dwhite shadow-xl',
                /* transitions */ 'translate-y-0 scale-100 transition duration-200 data-[closed]:translate-y-12 data-[closed]:opacity-0',
              )}
            >
              {/* HEADER */}
              <div
                className="group flex flex-row items-center justify-between border-b border-slate-300 bg-slate-50 p-2 group-data-[m]:border-none"
                onClick={() => {
                  if (minimized) setMinimized(false);
                }}
              >
                {/* switch sides */}
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="slate"
                  className="invisible group-data-[m]:invisible md:visible"
                  onClick={() => setSide()}
                >
                  {side === 'RIGHT' && <IconChevronLeftPipe />}
                  {side === 'LEFT' && <IconChevronRightPipe />}
                </ActionIcon>

                {/* panel name */}
                <div className="select-none text-sm">{PANEL_NAME}</div>

                <div className="flex flex-row items-center gap-1">
                  {/* minimize */}
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="slate"
                    onClick={() => setMinimized((b) => !b)}
                  >
                    {!minimized && <IconMinus />}
                    {minimized && <IconPlus />}
                  </ActionIcon>
                  {/* close */}
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="slate"
                    onClick={close}
                  >
                    <IconX />
                  </ActionIcon>
                </div>
              </div>

              {/* BODY */}
              <ScrollArea
                classNames={{
                  root: 'flex-1 transition-all group-data-[m]:max-h-0',
                  scrollbar: 'm-1',
                }}
              >
                <div className="@container flex h-full w-full flex-col">
                  <NewEventForm />
                </div>
              </ScrollArea>
            </DialogPanel>
          </motion.div>
        </div>
      </Dialog>
    </>
  );
}
