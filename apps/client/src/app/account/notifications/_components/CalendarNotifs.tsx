'use client';

import { Children } from '@/util/propTypes';
import { Switch } from '@mantine/core';
import { ComponentPropsWithoutRef } from 'react';

export default function CalendarNotifs() {
  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        {/* title */}
        <div className="flex flex-row items-center">
          <h3 className="px-2 text-lg">Calendar notifications</h3>
        </div>

        {/* members list */}
        <div className="mt-2 flex flex-col gap-4 px-4 py-2">
          <OptionSwitch
            label={<>Reservation reminders (1 week before)</>}
            description={
              <>
                <span>
                  Get a reminder a week before your stay to make sure your
                  reservation is still accurate.
                </span>
                <span>
                  <b>This is highly recommended!</b> Please be considerate to
                  your fellow campers by ensuring your reservations are
                  up-to-date.
                </span>
              </>
            }
          />
          <OptionSwitch
            label={<>Unexpected edits</>}
            description="Be notified when anyone (other than you) edits one of your calendar reservations."
          />
        </div>
      </div>
    </>
  );
}

function OptionSwitch({
  classNames: _,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Switch> & Children) {
  return (
    <Switch
      {...props}
      label={children ?? props.label}
      className="![--label-offset-start:1rem]"
      classNames={{
        input: 'peer',
        track:
          '[.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
        thumb: 'border-0',
        body: 'items-center',
        description: 'space-y-1 leading-tight *:block',
      }}
    />
  );
}
