'use client';

import { modals } from '@mantine/modals';
import { ExtendedMantineColors } from '@/theme/mantine';

import { clx } from '@/util/classConcat';

export type ModalProps = {
  /** button color */
  color?: ExtendedMantineColors;
  /** modal title */
  title?: React.ReactNode;
  /** only customize the inner prose */
  body?: React.ReactNode;
  /** fully custom modal body (disables `body`) */
  children?: React.ReactNode;
  /** customize button names */
  buttons?: { confirm?: string; cancel?: string };
  /** if true, confirm button will be focused (pressing enter confirms) */
  focusOnConfirm?: boolean;
};

export function confirmModal(p: ModalProps) {
  return new Promise<boolean>((resolve) => {
    const opts: MantineConfirmModalProps = {
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
        root: clx('focus:[&_button]:outline-black'),
        content: clx('rounded-xl p-2'),
      },
      onConfirm: () => resolve(true),
      onCancel: () => resolve(false),
    };
    if (p.focusOnConfirm) opts.confirmProps!['data-autofocus'] = '1';
    modals.openConfirmModal(opts);
  });
}

type MantineConfirmModalProps = Parameters<
  (typeof modals)['openConfirmModal']
>[0];
