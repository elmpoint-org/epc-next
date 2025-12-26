import ical from 'ical.js';

import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';
import { dateTSObject } from '@epc/date-ts';
import { ResultOf } from '@graphql-typed-document-node/core';
import {
  getCacheTimestamp,
  isCalStale,
  retrieveCache,
  updateCache,
} from './cache';
import dayjs from 'dayjs';

export const STAYS_QUERY = graphql(`
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
export type ICSStay = Inside<ResultOf<typeof STAYS_QUERY>['stays']>;
export type ICSRoom = Inside<ICSStay['reservations']>['room'] & {};

// ----------------------------------------

export async function getICSWithCache() {
  let isStale = true;

  // find most recent cache and determine if it's stale
  const lastGen = await getCacheTimestamp();
  if (lastGen) isStale = await isCalStale(lastGen);

  // get and return cache if it exists
  if (!isStale && lastGen) {
    const cache = await retrieveCache(lastGen);
    if (cache) return cache;
  }

  // otherwise generate new ics
  const now = dayjs().unix();
  const ical = await makeICS();
  if (!ical?.length) return null;

  // store new cache
  updateCache(now, ical);

  return ical;
}

export async function validateStayToken(token: string) {
  const { data, errors } = await graph(
    graphql(`
      query StayTokenValidate($token: String!) {
        stayTokenValidate(token: $token) {
          id
        }
      }
    `),
    { token }
  );
  if (errors || !data?.stayTokenValidate) return false;

  return true;
}

// ----------------------------------------

async function makeICS() {
  // get all stays
  const stays = await getStays();
  if (!stays) return;

  // create calendar
  const calendar = new ical.Component(['vcalendar', [], []]);
  calendar.updatePropertyWithValue('version', '2.0');
  calendar.updatePropertyWithValue('calscale', 'GREGORIAN');
  calendar.updatePropertyWithValue('prodid', 'elmpoint-org/epc-next');
  calendar.updatePropertyWithValue('method', 'PUBLISH');

  // add events
  for (const stay of stays) {
    const component = new ical.Component('vevent');
    const event = new ical.Event(component);

    event.uid = `${stay.id}@elmpoint.org`;
    event.summary = stay.title;
    event.startDate = getICALTime(stay.dateStart);
    event.endDate = getICALTime(stay.dateEnd, /* plusOne = */ true);
    event.description = stay.description + autoDescription(stay);
    if (stay.reservations.length && stay.reservations[0].room) {
      const room = stay.reservations[0].room;
      if ('id' in room) event.location = room.cabin?.name ?? room.name;
      else event.location = room.text;
    }

    calendar.addSubcomponent(component);
  }

  return calendar.toString();
}

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

function autoDescription(stay: ICSStay) {
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

https://www.elmpoint.org/calendar?date=${stay.dateStart}&view=AGENDA
`;
}

function roomText(room: ICSRoom) {
  return 'id' in room
    ? `${room.cabin ? `${room.cabin.name} - ` : ``}${room.name}`
    : `${room?.text}`;
}

function getICALTime(ts: number, plusOne?: boolean) {
  let d = dateTSObject(ts);
  if (plusOne) d = d.add(1, 'day');
  return new ical.Time(
    {
      isDate: true,
      year: d.year(),
      month: d.month() + 1,
      day: d.date(),
    },
    undefined as any
  );
}
