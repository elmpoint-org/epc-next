import { useCallback, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { DatePickerInput } from '@mantine/dates';

import { useFormCtx } from '../state/formCtx';
import { confirmModal } from '@/app/_components/_base/modals';
import { graphAuth, graphql } from '@/query/graphql';
import { useInvalidate } from '../../_components/ViewEvents';
import { useCloseFloatingWindow } from '@/app/_components/_base/FloatingWindow';
import { usePassedTransition } from '@/app/_ctx/transition';
import { useUser } from '@/app/_ctx/user/context';
import { SharedValues } from '@/util/inferTypes';
import { VariablesOf } from '@graphql-typed-document-node/core';
import { D1, TStoDate, dateTS } from '../../_util/dateUtils';
import { CUSTOM_ROOM_ID } from '@@/db/schema/Room/CABIN_DATA';
import { prettyError } from '@/util/prettyErrors';
import { dayStyles } from '../../_util/dayStyles';

export const UPDATE_STAY_QUERY = graphql(`
  mutation StayUpdate(
    $id: ID!
    $title: String
    $description: String
    $dateStart: Int
    $dateEnd: Int
    $reservations: [StayReservationInput!]
  ) {
    stayUpdate(
      id: $id
      title: $title
      description: $description
      dateStart: $dateStart
      dateEnd: $dateEnd
      reservations: $reservations
    ) {
      id
    }
  }
`);

export const CREATE_STAY_QUERY = graphql(`
  mutation StayCreate(
    $title: String!
    $description: String!
    $authorId: ID!
    $dateStart: Int!
    $dateEnd: Int!
    $reservations: [StayReservationInput!]!
  ) {
    stayCreate(
      title: $title
      description: $description
      authorId: $authorId
      dateStart: $dateStart
      dateEnd: $dateEnd
      reservations: $reservations
    ) {
      id
    }
  }
`);

type StayObject = SharedValues<
  VariablesOf<typeof CREATE_STAY_QUERY>,
  VariablesOf<typeof UPDATE_STAY_QUERY>
>;

export type ActionType = 'SUBMIT' | 'DUPLICATE' | 'SPLIT' | 'DELETE';

export function useFormActions() {
  const user = useUser();
  const { updateId } = useFormCtx();
  const getStayObject = useGetStayObject();

  // control final state
  const invalidate = useInvalidate();
  const closeDialog = useCloseFloatingWindow();
  const [, loading] = usePassedTransition();

  // FUNCTIONS

  // submit
  const handleSubmit = useCallback(
    () => {
      loading?.(async () => {
        if (!user) return err('MISSING_LOGIN_INFO');

        const stay = getStayObject();
        if (!stay) return;

        let resp: Awaited<ReturnType<typeof graphAuth>>;

        if (!updateId)
          resp = await graphAuth(CREATE_STAY_QUERY, {
            ...stay,
            authorId: user.id,
          });
        else
          resp = await graphAuth(UPDATE_STAY_QUERY, {
            ...stay,
            id: updateId,
          });

        if (resp.errors || !resp.data) return err(resp.errors?.[0].code);

        notifications.show({ message: 'Success!' });
        invalidate?.();
        closeDialog?.();
      });
    },
    // prettier-ignore
    [closeDialog, getStayObject, invalidate, loading, updateId, user],
  );

  // duplicate
  const handleDuplicate = useCallback(() => {
    loading?.(async () => {
      if (!user) return err('MISSING_LOGIN_INFO');

      const stay = getStayObject();
      if (!stay) return;

      const { data, errors } = await graphAuth(CREATE_STAY_QUERY, {
        ...stay,
        authorId: user.id,
      });
      if (errors || !data?.stayCreate) return err(errors?.[0].code ?? errors);

      notifications.show({ message: 'Success!' });
      invalidate?.();
      closeDialog?.();
    });
  }, [closeDialog, getStayObject, invalidate, loading, user]);

  // split
  const splitModal = useSplitModal();
  const handleSplit = useCallback(async () => {
    if (!updateId?.length) return;
    const stay = getStayObject();
    if (!stay) return;

    // get split date
    const nd = await splitModal(stay.dateStart, stay.dateEnd);
    if (nd === null) return;

    loading?.(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation StaySplit($id: ID!, $date: Int!) {
            staySplit(id: $id, date: $date) {
              id
            }
          }
        `),
        { id: updateId, date: nd },
      );
      if (errors || !data?.staySplit) return err(errors?.[0].code ?? errors);

      invalidate?.();
      closeDialog?.();
    });
  }, [closeDialog, getStayObject, invalidate, loading, splitModal, updateId]);

  // delete
  const handleDelete = useCallback(async () => {
    if (!updateId?.length) return;

    const yes = await confirmDeleteModal();
    if (!yes) return;

    loading?.(async () => {
      const { errors, data } = await graphAuth(
        graphql(`
          mutation StayDelete($id: ID!) {
            stayDelete(id: $id) {
              id
            }
          }
        `),
        { id: updateId },
      );
      if (errors || !data?.stayDelete) {
        notifications.show({
          color: 'red',
          message: 'An error occurred.',
        });
        return console.log(errors?.[0].code ?? errors);
      }

      invalidate?.();
      closeDialog?.();
    });
  }, [closeDialog, invalidate, loading, updateId]);

  // ----------------------------------
  const run = useCallback(
    (action: ActionType) => {
      if (action === 'SUBMIT') return handleSubmit();
      if (action === 'DUPLICATE') return handleDuplicate();
      if (action === 'SPLIT') return handleSplit();
      if (action === 'DELETE') return handleDelete();
    },
    [handleDelete, handleDuplicate, handleSplit, handleSubmit],
  );
  return run;
}

// -----------------------------------------

function confirmDeleteModal() {
  return confirmModal({
    color: 'red',
    title: <>Are you sure?</>,
    body: (
      <>
        <p>
          Are you sure you want to <b>permanently delete</b> this event?
        </p>
      </>
    ),
    buttons: { confirm: 'Permanently delete' },
  });
}

export function useGetStayObject() {
  const { dates, eventText, guests, updateId } = useFormCtx();

  const getStayObject = useCallback(() => {
    if (!(dates[0] && dates[1])) return err('INVALID_DATES');
    if (!eventText.title) return err('MISSING_TITLE');

    const stay: StayObject = {
      title: eventText.title,
      description: eventText.description,

      dateStart: dateTS(dates[0]),
      dateEnd: dateTS(dates[1]),

      reservations: guests
        .filter((g) => g.room.room)
        .map((g) => {
          if (g.room.room?.id === CUSTOM_ROOM_ID)
            return {
              name: g.name,
              customText: g.room.room.name,
            };
          return {
            name: g.name,
            roomId: g.room.room!.id,
          };
        }),
    };

    return stay;
  }, [dates, eventText.description, eventText.title, guests]);

  return getStayObject;
}

export function err(message: unknown) {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: prettyError(
      {
        __DEFAULT: `An unknown error occurred.`,
        INVALID_DATES: `Please enter a valid start and end date.`,
        MISSING_TITLE: `Please enter an event title.`,
      },
      (s) => `Unknown error code: ${s}`,
    )(message),
  });
}

function useSplitModal() {
  const runModal = useCallback(async (dateStart: number, dateEnd: number) => {
    let date: Date | null = null;

    const yes = await confirmModal({
      title: 'Split Event',
      body: (
        <>
          <p>
            This operation splits the selected event into two events around a
            specified date.
          </p>
          <p>Choose the date where you want to split the event.</p>

          <div className="not-prose">
            <DateSplitPicker
              {...{ dateStart, dateEnd }}
              onChange={(v) => (date = v)}
            />
          </div>
        </>
      ),
      buttons: {
        cancel: 'Cancel',
        confirm: 'Split',
      },
    });

    if (!yes || !date) return null;

    return dateTS(date);
  }, []);

  return runModal;
}

function DateSplitPicker(props: {
  dateStart: number;
  dateEnd: number;
  onChange?: (nv: Date | null) => void;
}) {
  const { dateStart, dateEnd, onChange } = props;

  const [date, setDate] = useState<Date | null>(null);
  const [dateShown, setDateShown] = useState<Date>(TStoDate(dateStart));

  return (
    <DatePickerInput
      aria-label="date to split event"
      placeholder="Click to choose date"
      value={date}
      onChange={(v) => {
        setDate(v);
        onChange?.(v);
      }}
      date={dateShown}
      onDateChange={setDateShown}
      minDate={TStoDate(dateStart + D1)}
      maxDate={TStoDate(dateEnd - D1)}
      firstDayOfWeek={0}
      classNames={{
        levelsGroup: 'popover:border-slate-300 popover:shadow-sm',
        day: dayStyles,
      }}
    />
  );
}
