import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';
import {
  CALENDAR_EVENT_FRAGMENT,
  emailNotifStayReminder,
} from '##/email/templates/notif_stay_reminder.js';
import { Inside } from '##/ics/functions.js';
import { catchTF } from '##/util/catchTF.js';
import { dateTS, dateTSObject, unixNow } from '@epc/date-ts';
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

  // filter down to events eligible for notification
  const eventsFiltered: Inside<typeof events>[] = [];
  for (const ev of events) {
    // skip events missing author or reminder already sent
    if (!ev.author || ev.reminderSent === true) continue;

    // check notif settings
    const notifs = ev.author.notifs;
    if (notifs?.UNSUBSCRIBED) continue;
    if (
      notifs?.calendarStayReminder ??
      NOTIF_DEFAULT_VALUES.calendarStayReminder
    ) {
      eventsFiltered.push(ev);
    }
  }

  // send emails
  const resps = await Promise.all(
    eventsFiltered.map(async (event) => {
      if (!event.author) return false;
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
  const today = dateTS(unixNow());
  const checkDate = dateTSObject(today).add(1, 'week').unix();

  const { data, errors } = await graph(STAY_REMINDER_QUERY, {
    start: checkDate,
    end: checkDate,
  });
  if (errors || !data?.stays) {
    console.error(errors);
    return;
  }

  return data.stays.filter((ev) => ev.dateStart === checkDate);
}
