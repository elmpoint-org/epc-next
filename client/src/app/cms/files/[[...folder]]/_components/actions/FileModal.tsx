import { Modal } from '@mantine/core';

import type { Children } from '@/util/propTypes';
import { clx } from '@/util/classConcat';

export type FileModalProps = {
  show: boolean;
  onHide?: (fullReset?: boolean) => void;
  currentFolder: string;
};

export default function FileModal(
  props: Children & Parameters<typeof Modal>[0],
) {
  const { children } = props;

  return (
    <>
      <Modal
        {...props}
        classNames={{
          content: clx('rounded-xl p-2'),
          header:
            'before:absolute before:inset-x-0 before:-top-40 before:h-40 before:bg-dwhite',
        }}
      >
        <div className="mb-4 border-b border-slate-200" />

        {/* body */}
        {children}
      </Modal>
    </>
  );
}
