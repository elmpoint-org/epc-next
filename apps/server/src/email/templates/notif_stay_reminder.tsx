import { Button, Footer, HR, Link, Prose, Title, Wrapper } from '../components';
import { sendWithBrevo } from '../send';

import { siteDomain } from '##/util/dev.js';
import { graphql } from '##/db/lib/utilities.js';
import { ResultOf } from '@graphql-typed-document-node/core';
import { Preview } from '@react-email/components';
import { dateFormat } from '@epc/date-ts';

export const CALENDAR_EVENT_FRAGMENT = graphql(`
  fragment CalendarEvent on Stay @_unmask {
    title
    description
    author {
      firstName
      email
    }
    dateStart
    dateEnd
    reservations {
      name
      room {
        ... on Room {
          name
          cabin {
            name
          }
        }
        ... on CustomRoom {
          text
        }
      }
    }
  }
`);
type EventType = ResultOf<typeof CALENDAR_EVENT_FRAGMENT>;
type RoomType = EventType['reservations'][number]['room'] & {};

/** verify a user's email address for registration. */
export async function emailNotifStayReminder(
  emailAddress: string,
  props: Props
) {
  // due to volume concerns, these mesesages should only run on the fallback vendor.
  return sendWithBrevo({
    to: emailAddress,
    subject: SUBJECT(props.event.dateStart),
    content: Content(props),
  });
}

type Props = {
  event: EventType;
};

const SUBJECT = (ts: number) =>
  `Upcoming stay at Elm Point on ${dateFormat(ts, 'MMMM D')}`;
function Content({ event }: Props) {
  return (
    <>
      <Preview>
        Hi {event.author?.firstName ?? 'there'}! You have an upcoming stay at
        Elm Point on {fullDate(event.dateStart)}. Double check that your
        reservation details are correct!
      </Preview>
      <Wrapper
        children={
          <>
            <Prose>
              <Title>Your stay is coming up soon!</Title>
              <p>Hi {event.author?.firstName ?? ''},</p>
              <p>
                This is a reminder that you have an upcoming stay on the Elm
                Point calendar beginning <b>{fullDate(event.dateStart)}</b>.
              </p>

              <p>
                Please double check that your reservation details are correct!
                You can edit or remove the reservation by clicking the button
                below.
              </p>

              {/* event block */}
              <div className="px-5 py-1 mt-8 border rounded-lg border-slate-300 border-solid">
                {/* event name */}
                <p className="text-base">
                  <b>{event.title}</b>
                </p>

                {/* dates */}
                <p className="-mt-3">
                  {fullDate(event.dateStart)}
                  <span className="text-slate-400"> &ndash; </span>
                  {fullDate(event.dateEnd)}
                </p>
                <HR />

                {/* description */}
                {!!event.description.length && (
                  <>
                    <p className="text-xs">{newlineText(event.description)}</p>
                    <HR />
                  </>
                )}

                {/* reservations */}
                <p className="text-xs mt-4">
                  {event.reservations
                    .filter((r) => !!r.room)
                    .map((r, i) => (
                      <>
                        {!!i && <br />}
                        <span className="font-semibold text-slate-700">
                          {r.name}
                        </span>
                        <br />
                        <span className="t">{roomText(r.room!)}</span>
                        <br />
                      </>
                    ))}
                </p>
              </div>

              <Button className="mt-4" href={`${siteDomain}/calendar/upcoming`}>
                View/Edit Event
              </Button>
            </Prose>
          </>
        }
        footer={
          <Footer className="!break-normal">
            <p className="max-w-[384px] mx-auto ">
              You’re receiving this message because you have calendar reminders
              enabled. Click{' '}
              <Link href={siteDomain + '/account/notifications'}>here</Link> to
              edit your notification preferences.
            </p>
          </Footer>
        }
      />
    </>
  );
}

function fullDate(ts: number) {
  return dateFormat(ts, 'dddd, MMMM D');
}

function newlineText(str: string) {
  return str.split('\n').map((line, i) => (
    <>
      {!!i && <br />}
      {line}
    </>
  ));
}

function roomText(room: RoomType) {
  return 'name' in room
    ? `${room.cabin ? `${room.cabin.name} - ` : ``}${room.name}`
    : `${room?.text}`;
}

// -------------------------------------

export default function __TEST() {
  return (
    <Content
      event={{
        title: 'Event title',
        description: 'Event description',
        dateStart: 1749340800,
        dateEnd: 1749600000,
        author: {
          firstName: 'Michael',
          email: 'email@example.com',
        },
        reservations: [
          {
            name: 'Person 1',
            room: {
              name: 'Room Name',
              cabin: {
                name: 'Cabin Name',
              },
            },
          },
          {
            name: 'Person 2',
            room: {
              name: 'Day Tripper',
              cabin: null,
            },
          },
          {
            name: 'test name',
            room: {
              text: 'test room',
            },
          },
        ],
      }}
    />
  );
}
