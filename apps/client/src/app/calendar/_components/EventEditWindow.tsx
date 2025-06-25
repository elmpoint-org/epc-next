import { lazy, useEffect, useState } from 'react';

import {
  ReverseCbProp,
  useReverseCb,
  useReverseCbTrigger,
} from '@/util/reverseCb';
import { usePassedTransition } from '@/app/_ctx/transition';
import { graphAuth, graphql } from '@/query/graphql';
import { EventType } from './Calendar';
import { ROOM_FRAGMENT } from '../new/state/getRoomData';
import { notifications } from '@mantine/notifications';
import { InitialStayValue } from '../new/state/formCtx';
import { dateTSLocal } from '@epc/date-ts';
import { CUSTOM_ROOM_OBJ } from '@epc/types/cabins';

import FloatingWindow from '@/app/_components/_base/FloatingWindow';

const NewEventForm = lazy(() => import('../new/_components/NewEventForm'));

export default function EventEditWindow({
  trigger,
  event,
  showDate,
}: {
  trigger: ReverseCbProp;
  event?: EventType;
  showDate?: Date;
}) {
  // window open trigger
  const { prop: windowProp, trigger: openWindow } = useReverseCbTrigger();

  // initial value for form
  const [formValue, setFormValue] = useState<InitialStayValue | null>(null);

  // get room data for form if needed
  const [, loading] = usePassedTransition();
  useReverseCb(trigger, () => {
    if (!event) return openWindow();
    loading?.(async () => {
      const { data, errors } = await graphAuth(
        graphql(
          `
            query RoomsById($ids: [ID!]!, $start: Int, $end: Int, $ignore: ID) {
              roomsById(ids: $ids) {
                ...StayRoomData
              }
            }
          `,
          [ROOM_FRAGMENT],
        ),
        {
          ids: event.reservations
            .map((r) => {
              if (r.room && 'id' in r.room) return r.room.id;
            })
            .filter((it): it is string => !!it),
        },
      );
      if (errors || !data?.roomsById) {
        notifications.show({ color: 'red', message: 'An error occurred.' });
        return console.log(errors?.[0].code ?? errors);
      }

      // otherwise populate and trigger window
      const rooms = data.roomsById;
      const guests: InitialStayValue['guests'] = event.reservations.map((r) => {
        // no resolvable room
        if (!r.room)
          return {
            name: r.name,
            room: { room: null, cabin: null },
          };

        // custom rooms
        if ('text' in r.room)
          return {
            name: r.name,
            room: { cabin: null, room: CUSTOM_ROOM_OBJ(r.room.text) },
          };

        const id = r.room.id;
        // otherwise
        const room = rooms.find((it) => it && it.id === id);

        return {
          name: r.name,
          room: {
            room: room ?? null,
            cabin: room?.cabin ?? null,
          },
        };
      });

      setFormValue({
        id: event.id,
        dates: [
          new Date(dateTSLocal(event.dateStart) * 1000),
          new Date(dateTSLocal(event.dateEnd) * 1000),
        ],
        eventText: { title: event.title, description: event.description },
        guests,
      });
    });
  });

  // open window once data has populated
  useEffect(() => {
    if (formValue) openWindow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  return (
    <>
      <FloatingWindow
        triggerOpen={windowProp}
        title={event ? <>Edit Stay</> : <>Add Your Stay</>}
        width="48rem"
      >
        <NewEventForm initial={formValue ?? undefined} showDate={showDate} />
      </FloatingWindow>
    </>
  );
}
