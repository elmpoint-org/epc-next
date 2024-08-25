'use client';

import { ActionIcon } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import { useReverseCbTrigger } from '@/util/reverseCb';

import ViewEvents from './ViewEvents';
import FloatingWindow from '@/app/_components/_base/FloatingWindow';
import NewEventForm from '../new/_components/NewEventForm';

export default function CalendarWrapper() {
  const { prop: newStay, trigger: openNewStay } = useReverseCbTrigger();

  return (
    <>
      <div className="flex flex-row justify-between">
        <h3 className="text-xl">calendar page</h3>
        <ActionIcon color="slate" variant="light" onClick={openNewStay}>
          <IconPlus />
        </ActionIcon>
      </div>

      <hr />

      <ViewEvents />

      {/* popups */}
      <FloatingWindow
        triggerOpen={newStay}
        title={<>Add Your Stay</>}
        width="48rem"
      >
        <NewEventForm />
      </FloatingWindow>
    </>
  );
}
