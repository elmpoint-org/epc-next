'use client';

import { DefaultMantineColor } from '@mantine/core';
import { modals } from '@mantine/modals';

import { clx } from '@/util/classConcat';

export type ModalProps = {
  /** button color */
  color?: DefaultMantineColor;
  /** modal title */
  title?: React.ReactNode;
  /** only customize the inner prose */
  body?: React.ReactNode;
  /** fully custom modal body (disables `body`) */
  children?: React.ReactNode;
  /** customize button names */
  buttons?: { confirm?: string; cancel?: string };
};

export function confirmModal(p: ModalProps) {
  return new Promise<boolean>((resolve) =>
    modals.openConfirmModal({
      title: p.title ?? 'Are you sure?',
      children: p.children ? (
        <>{p.children}</>
      ) : (
        <>
          <div className="mb-4 border-b border-slate-200" />

          <div className="prose prose-sm leading-normal">
            {/*  */}
            {p.body}
          </div>
          <div className="h-2"></div>
        </>
      ),
      labels: {
        confirm: p.buttons?.confirm ?? 'Confirm',
        cancel: p.buttons?.cancel ?? 'Cancel',
      },
      confirmProps: { color: p.color },
      classNames: {
        content: clx('rounded-xl p-2'),
      },
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    }),
  );
}
