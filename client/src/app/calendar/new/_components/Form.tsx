'use client';

import { Button } from '@mantine/core';

import { FormCtxProvider } from '../state/formCtx';
import FormCalendar from './FormCalendar';
import DateStats from './DateStats';
import RoomNumBox from './RoomNumBox';
import FormGuestRows from './FormGuestRows';
import FormEventText from './FormEventText';
import TitleBlock from './TitleBlock';

export const COST_MEMBERS = 15.0;
export const COST_GUESTS = 20.0;
export const MAX_ROOMS = 20;

const NewEventForm = () => {
  return (
    <>
      <hr className="t" />
      <FormCtxProvider>
        <div className="m-6 mx-auto max-w-3xl p-4 md:mt-0 md:p-8 lg:mt-6">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <TitleBlock number={1} title="Choose your dates">
              <p>
                To begin, select the dates of your visit below. You can select
                dates on the calendar if you wish, or type them directly into
                the textboxes.
              </p>
            </TitleBlock>

            {/* DATE ENTRY */}
            <FormCalendar />
            <DateStats />

            <hr className="t" />

            <TitleBlock number={2} title="Reserve your rooms">
              <p>
                Use this section to indicate who is coming with you and find
                places for them to sleep. Here are a few things to know:
              </p>
              <ul>
                <li>
                  Each row below is counted as the use of <i>1 bed</i>. This is
                  most important for bunk-style rooms where it’s important to
                  count the number of occupants.
                </li>
                <li>
                  You can search for rooms and cabins by their names, or various
                  nicknames may also be accepted (e.g. “Grammy’s Room”).
                </li>
                <li>
                  You can always type in a custom phrase if you’re staying
                  somewhere unusual, but remember this will prevent the site
                  from being able to identify and remedy conflicting
                  schedulings.
                </li>
              </ul>
            </TitleBlock>

            {/* ROOM SELECTION */}
            <RoomNumBox />
            <FormGuestRows />

            <hr className="t" />

            <TitleBlock number={3} title="Add a message">
              <p>
                Use this section to edit how your stay will appear on the
                calendar. I have attempted to guess a title for you, but you can
                change it to anything you’d like and always return to the
                default with the button on the right side.
              </p>
            </TitleBlock>

            {/* EVENT DETAILS */}
            <FormEventText />

            {/* SUBMIT */}
            <div className="flex flex-row">
              <div className="flex-1"></div>
              <Button type="submit" variant="light">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </FormCtxProvider>
    </>
  );
};
export default NewEventForm;
