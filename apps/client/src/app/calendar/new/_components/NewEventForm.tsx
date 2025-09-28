'use client';

import { Button, Kbd } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';

import { FormCtxProvider, InitialStayValue } from '../state/formCtx';
import { useReverseCbTrigger } from '@/util/reverseCb';
import { usePassedTransition } from '@/app/_ctx/transition';
import { useKeyboardKeys } from '@/util/keyboardKeys';

import FormCalendar from './FormCalendar';
import DateStats from './DateStats';
import RoomNumBox from './RoomNumBox';
import FormGuestRows from './FormGuestRows';
import FormEventText from './FormEventText';
import FormSubmit from './FormSubmit';
import FormHeader from './FormHeader';
import ConflictsModal from './ConflictsModal';

export const MAX_ROOMS = 20;

const NewEventForm = ({
  initial,
  showDate,
}: {
  initial?: InitialStayValue;
  showDate?: Date;
}) => {
  const { prop: submitTrigger, trigger: handleSubmit } = useReverseCbTrigger();

  const [isLoading] = usePassedTransition();

  const keyType = useKeyboardKeys();

  return (
    <>
      <FormCtxProvider initial={initial} showDate={showDate}>
        <FormSubmit trigger={submitTrigger} />
        <div
          className="m-6 mx-auto mt-0 max-w-full p-4 @md:p-8"
          onKeyDown={getHotkeyHandler([['mod+Enter', handleSubmit]])}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="flex flex-col gap-4"
          >
            <FormHeader />

            <hr className="first:hidden" />

            {/* DATE ENTRY */}
            <FormCalendar />
            <DateStats />

            <hr />

            {/* ROOM SELECTION */}
            <RoomNumBox />
            <FormGuestRows />

            <hr />

            {/* EVENT DETAILS */}
            <FormEventText />

            {/* SUBMIT */}
            <div className="flex flex-row justify-end">
              {/* submit */}
              <div className="flex flex-row items-center gap-4">
                {keyType !== 'MOBILE' && (
                  <div className="text-slate-600">
                    <Kbd>{keyType === 'MAC' ? `⌘` : `Ctrl`}</Kbd>
                    <span> + </span>
                    <Kbd>Enter</Kbd> to submit
                  </div>
                )}
                <Button
                  variant="light"
                  onClick={() => handleSubmit()}
                  loading={isLoading ?? false}
                >
                  Submit
                </Button>

                <ConflictsModal />
              </div>
            </div>
          </form>
        </div>
      </FormCtxProvider>
    </>
  );
};
export default NewEventForm;
