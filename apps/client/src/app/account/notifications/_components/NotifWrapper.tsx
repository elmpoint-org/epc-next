'use client';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { useMemo } from 'react';
import { ResultOf } from '@graphql-typed-document-node/core';
import { InvalidateProvider } from '../_ctx/notifInvalidate';

import ColorText from '@/app/_components/_base/ColorText';
import CalendarNotifs from './CalendarNotifs';
import Unsubscribe from './Unsubscribe';

const NOTIFS_QUERY = graphql(`
  query Notifs {
    userFromAuth {
      notifs {
        UNSUBSCRIBED
        calendarStayReminder
      }
    }
  }
`);
export type NotifsType = (ResultOf<
  typeof NOTIFS_QUERY
>['userFromAuth'] & {})['notifs'] & {};

export default function NotifWrapper() {
  const query = useGraphQuery(NOTIFS_QUERY);
  const notifs = useMemo(
    () => query.data?.userFromAuth?.notifs ?? null,
    [query.data?.userFromAuth?.notifs],
  );

  const props: NotifsProps = {
    notifs,
    isPending: query.isPending,
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* leader text */}
        <p className="my-4">
          Choose which <ColorText>email notifications</ColorText> you’d like to
          receive below.
        </p>

        <InvalidateProvider cb={query.refetch}>
          {/* options */}
          <CalendarNotifs {...props} />
          <Unsubscribe />
        </InvalidateProvider>
      </div>
    </>
  );
}

export type NotifsProps = {
  notifs: NotifsType | null;
  isPending: boolean;
};
