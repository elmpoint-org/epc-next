import { notifications } from '@mantine/notifications';

import { ReverseCbProp, useReverseCb } from '@/util/reverseCb';
import { useFormCtx } from '../state/formCtx';
import { usePassedTransition } from '@/app/_ctx/transition';
import { GraphAuthErrors, graphAuth, graphql } from '@/query/graphql';
import { useUser } from '@/app/_ctx/user/context';
import { dateTS } from '../../_util/dateUtils';
import { CUSTOM_ROOM_ID } from '@@/db/schema/Room/CABIN_DATA';
import { prettyError } from '@/util/prettyErrors';
import { useInvalidate } from '../../_components/ViewEvents';
import { useCloseFloatingWindow } from '@/app/_components/_base/FloatingWindow';
import { SharedValues } from '@/util/inferTypes';
import { VariablesOf } from '@graphql-typed-document-node/core';

const UPDATE_STAY = graphql(`
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

const CREATE_STAY = graphql(`
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
  VariablesOf<typeof CREATE_STAY>,
  VariablesOf<typeof UPDATE_STAY>
>;

export default function FormSubmit({
  trigger: onSubmit,
}: {
  trigger: ReverseCbProp;
}) {
  const { dates, eventText, guests, updateId } = useFormCtx();

  const [, loading] = usePassedTransition();

  const user = useUser();

  const invalidate = useInvalidate();
  const closeDialog = useCloseFloatingWindow();

  useReverseCb(onSubmit, () => {
    loading?.(async () => {
      if (!user) return err('MISSING_LOGIN_INFO');
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

      let resp: Awaited<ReturnType<typeof graphAuth>>;

      if (!updateId)
        resp = await graphAuth(CREATE_STAY, {
          ...stay,
          authorId: user.id,
        });
      else
        resp = await graphAuth(UPDATE_STAY, {
          ...stay,
          id: updateId,
        });

      if (resp.errors || !resp.data) return err(resp.errors?.[0].code);

      notifications.show({ message: 'Success!' });
      invalidate?.();
      closeDialog?.();
    });
  });

  return null;
}

function err(message: unknown) {
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
