'use client';

import { type ReactNode } from 'react';

import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const TitleBlock = (p: {
  number: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) => {
  const [isOpen, { toggle }] = useDisclosure(false);

  return (
    <>
      <div className="mb-2 mt-6 flex flex-col gap-3 px-0 first:mt-0 @2xl:px-8">
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle();
          }}
          className="my-2 flex flex-row items-center justify-center gap-3 rounded-full bg-slate-200 py-4"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-dgreen text-sm font-bold text-dwhite">
            {p.number}
          </div>
          <h3 className="text-xl">{p.title}</h3>
        </button>

        <Collapse in={isOpen}>
          <div className="prose mb-4 px-4">{p.children}</div>
        </Collapse>
      </div>
    </>
  );
};
export default TitleBlock;
