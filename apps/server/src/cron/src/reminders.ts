import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';
import {
  CALENDAR_EVENT_FRAGMENT,
  emailNotifStayReminder,
} from '##/email/templates/notif_stay_reminder.js';
import { Inside } from '##/ics/functions.js';
import { catchTF } from '##/util/catchTF.js';
import { dateTS, dateTSObject } from '@epc/date-ts';
import { NOTIF_DEFAULT_VALUES } from '@epc/gql-consts/notifs';
import { ResultOf } from '@graphql-typed-document-node/core';

const NOTIF_FRAGMENT = graphql(`
  fragment Notifs on User @_unmask {
    notifs {
      UNSUBSCRIBED
      calendarStayReminder
    }
  }
`);
const STAY_REMINDER_QUERY = graphql(
  `
    query Stays($start: Int!, $end: Int!) {
      stays(start: $start, end: $end) {
        ...CalendarEvent

        id
        reminderSent
        author {
          id
          ...Notifs
        }
      }
    }
  `,
  [CALENDAR_EVENT_FRAGMENT, NOTIF_FRAGMENT]
);

type ReminderStay = Inside<ResultOf<typeof STAY_REMINDER_QUERY>['stays']>;

export async function runEventReminders() {
  const events = await getEvents();
  if (!events?.length) return;

  // only get events with authors and reminders that have not already been sent out
  let eventsFiltered = events.filter(
    (ev): ev is typeof ev & { author: NonNullable<typeof ev.author> } =>
      !!ev.author && ev.reminderSent !== true
  );

  // filter based on author notification preferences
  const authorNotifMap = new Map(
    eventsFiltered
      .map((ev) => ev.author)
      .filter(Boolean)
      .map((author) => [author.id, author?.notifs])
  );
  eventsFiltered = eventsFiltered.filter((ev) => {
    const n = authorNotifMap.get(ev.author.id);
    if (n?.UNSUBSCRIBED) return false;
    return n?.calendarStayReminder ?? NOTIF_DEFAULT_VALUES.calendarStayReminder;
  });

  // send emails
  const resps = await Promise.all(
    eventsFiltered.map(async (event) => {
      const success = await emailNotifStayReminder(event.author.email, {
        event,
      });
      if (!success) return false;
      return catchTF(() =>
        graph(
          graphql(`
            mutation StayUpdate($id: ID!, $reminderSent: Boolean) {
              stayUpdate(id: $id, reminderSent: $reminderSent) {
                id
              }
            }
          `),
          { id: event.id, reminderSent: true }
        )
      );
    })
  );
}

/**
 * get all events occurring 1 week from now
 */
async function getEvents() {
  const today = dateTS(Date.now() / 1000);
  const checkDate = dateTSObject(today).add(1, 'week').unix();

  const { data, errors } = await graph(STAY_REMINDER_QUERY, {
    start: checkDate,
    end: checkDate,
  });
  if (errors || !data?.stays) {
    console.error(errors);
    return;
  }

  return data.stays;
}
