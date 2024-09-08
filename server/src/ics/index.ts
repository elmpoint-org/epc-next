import express from 'express';
import ical from 'ical.js';

import { graph } from '@@/db/graph';
import { graphql } from '@@/db/lib/utilities';
import { dateTSObject } from '@@/db/schema/Stay/functions';
import { ResultOf } from '@graphql-typed-document-node/core';

const STAYS_QUERY = graphql(`
  query Stays($start: Int!, $end: Int!) {
    stays(start: $start, end: $end) {
      id
      title
      description
      dateStart
      dateEnd
      author {
        id
        name
      }
      reservations {
        name
        room {
          ... on Room {
            id
            name
            cabin {
              id
              name
            }
          }
          ... on CustomRoom {
            text
          }
        }
      }
      timestamp {
        created
        updated
      }
    }
  }
`);
export type Inside<Arr> = Arr extends Array<infer T> ? T : never;
type Stay = Inside<ResultOf<typeof STAYS_QUERY>['stays']>;
type Room = Inside<Stay['reservations']>['room'] & {};

const r = express.Router();
export default r;

r.get('/:id', async (_, res) => {
  try {
    const stays = await getStays();
    if (!stays) return res.err(500, 'SERVER_ERROR');

    const calendar = new ical.Component(['vcalendar', [], []]);
    calendar.updatePropertyWithValue('version', '2.0');
    calendar.updatePropertyWithValue('calscale', 'GREGORIAN');
    calendar.updatePropertyWithValue('prodid', 'elmpoint-org/epc-next');
    calendar.updatePropertyWithValue('method', 'PUBLISH');

    for (const stay of stays.slice(stays.length - 15)) {
      const component = new ical.Component('vevent');
      const event = new ical.Event(component);

      event.uid = `${stay.id}@elmpoint.org`;
      event.summary = stay.title;
      event.startDate = getICALTime(stay.dateStart);
      event.endDate = getICALTime(stay.dateEnd);
      event.description = stay.description + description(stay);
      if (stay.reservations.length && stay.reservations[0].room) {
        const room = stay.reservations[0].room;
        if ('id' in room) event.location = room.cabin?.name ?? room.name;
        else event.location = room.text;
      }

      calendar.addSubcomponent(component);
    }

    res.contentType('text/calendar');
    res.end(calendar.toString());
  } catch (error) {
    console.log(error);
    res.err(500, 'SERVER_ERROR');
  }
});

// -----------------

async function getStays() {
  const { data, errors } = await graph(STAYS_QUERY, {
    start: 0,
    end: 2147483647,
  });
  if (errors || !data?.stays) {
    console.log(errors);
    return;
  }

  return data.stays;
}

function description(stay: Stay) {
  return `

—————————————
${stay.reservations
  .filter((r) => r.room)
  .map(
    (r) => `
${r.name}
${roomText(r.room!)}
`
  )
  .join('')}

https://one.elmpoint.xyz/calendar?date=${stay.dateStart}
`;
}

function roomText(room: Room) {
  return 'id' in room
    ? `${room.cabin ? `${room.cabin.name} - ` : ``}${room.name}`
    : `${room?.text}`;
}

function getICALTime(ts: number) {
  const d = dateTSObject(ts);
  return new ical.Time({
    isDate: true,
    year: d.year(),
    month: d.month() + 1,
    day: d.date(),
  });
}
