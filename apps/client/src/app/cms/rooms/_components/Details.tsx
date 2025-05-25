import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';

import { clx } from '@/util/classConcat';
import { IconTypeProps } from '@/util/iconType';
import { Children } from '@/util/propTypes';

export default function Details({
  summary,
  open,
  children,
}: { summary: React.ReactNode; open?: boolean } & Children) {
  const [isOpen, { toggle }] = useDisclosure(open);

  const iconProps: IconTypeProps = { className: clx('size-5') };

  return (
    <>
      <div className="flex flex-col">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          className="-m-1 flex flex-row items-center gap-1 p-1 text-slate-600"
        >
          {isOpen ? (
            <IconChevronDown {...iconProps} />
          ) : (
            <IconChevronRight {...iconProps} />
          )}
          {summary}
        </button>

        <Collapse in={isOpen}>
          <div className="flex flex-col gap-2 p-2 pl-4">{children}</div>
        </Collapse>
      </div>
    </>
  );
}
