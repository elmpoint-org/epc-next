import { CloseButton } from '@mantine/core';

import type { Children } from '@/util/propTypes';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

export type FileModalProps = {
  show: boolean;
  onHide: (fullReset?: boolean) => void;
  currentFolder: string;
};

export function ModalFrame({
  children,
  title,
  ...props
}: { title?: React.ReactNode } & Parameters<typeof Dialog>[0] & Children) {
  return (
    <Dialog {...props}>
      {/* backdrop */}
      <DialogBackdrop
        transition
        className="fixed inset-0 z-[200] bg-black/50 transition duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-[200] flex flex-col items-center overflow-y-auto p-4 pt-8 sm:pt-12">
        {/* panel */}
        <DialogPanel
          transition
          className="panel flex w-full max-w-md translate-y-0 flex-col gap-4 rounded-xl bg-dwhite p-6 shadow-xl transition duration-150 ease-out data-[closed]:-translate-y-8 data-[closed]:opacity-0"
        >
          {/* header */}
          <div className="flex flex-row items-center gap-2 border-b border-slate-300 pb-4">
            <DialogTitle className="flex-1">{title}</DialogTitle>

            <CloseButton onClick={() => props.onClose(false)} />
          </div>

          {/* body */}
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

/**
 * the modal footer expects to be placed in parent with a gap of **1rem**. if your already-existing parent doesn't account for this, wrap this with a `div.space-y-4`.
 */
export function ModalFrameFooter({ children }: Children) {
  return (
    <>
      <hr className="mt-2 border-slate-300" />

      {children}
    </>
  );
}
