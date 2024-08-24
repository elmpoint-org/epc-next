'use client';

import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { useReverseCbTrigger } from '@/util/reverseCb';

import ViewEvents from './ViewEvents';
import NewStayDialog from './NewStayDialog';

export default function CalendarWrapper() {
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  return (
    <>
      <div className="flex flex-row justify-between">
        <h3 className="text-xl">calendar page</h3>
        <ActionIcon
          // component={Link}
          // href="/calendar/new"
          // size="sm"
          color="slate"
          variant="light"
          onClick={openNewStay}
        >
          <IconPlus />
        </ActionIcon>
      </div>

      <hr />

      <ViewEvents />

      <NewStayDialog trigger={newStay} />
    </>
  );
}
