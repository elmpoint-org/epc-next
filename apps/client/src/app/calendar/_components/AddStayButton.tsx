'use client';

import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { dateTSLocal } from '@epc/date-ts';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { CalendarProps } from './Calendar';

import EventEditWindow from './EventEditWindow';
import { clx } from '@/util/classConcat';

export default function AddStayButton({
  selectedDate,
  compactOnly,
}: Partial<Pick<CalendarProps, 'selectedDate'>> & { compactOnly?: boolean }) {
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  return (
    <>
      {/* mobile stay button */}
      <Tooltip label="Add new stay">
        <ActionIcon
          aria-label="add new stay"
          color="slate"
          variant="light"
          onClick={openNewStay}
          className={clx(!compactOnly && 'xl:hidden')}
        >
          <IconPlus />
        </ActionIcon>
      </Tooltip>

      {/* stay button */}
      {!compactOnly && (
        <Button
          size="compact-md"
          color="slate"
          variant="light"
          justify="center"
          leftSection={<IconPlus />}
          onClick={openNewStay}
          className="hidden pr-3 text-sm xl:block"
        >
          Add new stay
        </Button>
      )}

      {/* new event popup */}
      <EventEditWindow
        trigger={newStay}
        showDate={
          typeof selectedDate === 'number'
            ? new Date(dateTSLocal(selectedDate) * 1000)
            : undefined
        }
      />
    </>
  );
}
