'use client';

import { useEffect, useState, useTransition } from 'react';

import { Dialog, DialogPanel, Transition } from '@headlessui/react';
import { ActionIcon, ScrollArea } from '@mantine/core';
import { useDisclosure, useToggle } from '@mantine/hooks';
import {
  IconChevronLeftPipe,
  IconChevronRightPipe,
  IconLoader2,
  IconMinus,
  IconPlus,
  IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { Children } from '@/util/propTypes';
import {
  ReverseCbProp,
  useReverseCb,
  type useReverseCbTrigger,
} from '@/util/reverseCb';
import { clx } from '@/util/classConcat';
import { TransitionProvider } from '@/app/_ctx/transition';
import { createCallbackCtx } from '@/app/_ctx/callback';

const { Provider: CloseProvider, useHook: useCloseFloatingWindow } =
  createCallbackCtx();
export { useCloseFloatingWindow };

// COMPONENT
export default function FloatingWindow({
  triggerOpen,
  children,
  title,
  width,
}: {
  /** use a {@link useReverseCbTrigger} call to open the window. */
  triggerOpen: ReverseCbProp;
  title?: React.ReactNode;
  width?: string;
} & Children) {
  const [isOpen, { open, close }] = useDisclosure();
  useReverseCb(triggerOpen, open);

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

  const transition = useTransition();
  const [isLoading] = transition;

  return (
    <>
      <CloseProvider cb={() => close()}>
        <TransitionProvider transition={transition}>
          <Dialog open={isOpen} onClose={safeClose}>
            {/* frame */}
            <div
              className={clx(
                'group fixed inset-2 z-[199] flex flex-row items-end sm:inset-6',
                side === 'LEFT' && 'justify-start',
                side === 'RIGHT' && 'justify-end',
              )}
              data-m={minimized || null}
            >
              {/* panel */}
              <motion.div
                layout
                className="flex h-full flex-col justify-end group-data-[m]:!w-96"
                style={{
                  width: width ?? '48rem',
                }}
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
                    className="group flex flex-row items-center justify-between border-b border-slate-300 p-2 group-data-[m]:border-none"
                    onClick={() => {
                      if (minimized) setMinimized(false);
                    }}
                  >
                    {/* switch sides */}
                    <ActionIcon
                      aria-label="switch to other side"
                      size="sm"
                      variant="subtle"
                      color="slate"
                      className="invisible group-data-[m]:invisible md:visible"
                      onClick={() => setSide()}
                    >
                      {side === 'RIGHT' && <IconChevronLeftPipe />}
                      {side === 'LEFT' && <IconChevronRightPipe />}
                    </ActionIcon>

                    {/* center section */}
                    <div className="flex flex-row items-center gap-2">
                      {/* loading */}
                      <Transition show={isLoading}>
                        <div
                          className={clx(
                            'flex items-center justify-center',
                            /* transition */ 'translate-x-0 transition data-[closed]:-translate-x-4 data-[closed]:opacity-0',
                          )}
                        >
                          <IconLoader2
                            size={16}
                            className="animate-spin text-slate-600"
                          />
                        </div>
                      </Transition>

                      {/* PANEL NAME */}
                      <div className="select-none text-sm">{title}</div>
                    </div>

                    <div className="flex flex-row items-center gap-1">
                      {/* minimize */}
                      <ActionIcon
                        aria-label="minimize"
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
                        aria-label="close window"
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
                    <div className="flex h-full w-full flex-col @container">
                      {children}
                    </div>
                  </ScrollArea>
                </DialogPanel>
              </motion.div>
            </div>
          </Dialog>
        </TransitionProvider>
      </CloseProvider>
    </>
  );
}
