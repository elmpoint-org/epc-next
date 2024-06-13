'use client';

import { Children } from '@/util/propTypes';
import { ModalsProvider } from '@mantine/modals';

export function ModalProvider({ children }: Children) {
  return (
    <>
      <ModalsProvider>
        {/*  */}
        {children}
      </ModalsProvider>
    </>
  );
}
