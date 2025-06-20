'use client';

import { useCallback } from 'react';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { useNotifInvalidate } from '../_ctx/notifInvalidate';
import { useLoading } from '@/util/useLoading';
import { graphAuth, graphql } from '@/query/graphql';
import { useUser } from '@/app/_ctx/user/context';
import { prettyErrorPlaceholder } from '@/util/prettyErrors';

export default function Unsubscribe() {
  const user = useUser();
  const invalidate = useNotifInvalidate();

  const [isLoading, loading] = useLoading();

  const handleUnsub = useCallback(() => {
    loading(async () => {
      if (!user) return;
      const { data, errors } = await graphAuth(
        graphql(`
          mutation UserNotifUpdate($id: ID!, $notifs: UserNotifInput!) {
            userNotifUpdate(id: $id, notifs: $notifs) {
              id
            }
          }
        `),
        { id: user.id, notifs: { UNSUBSCRIBED: true } },
      );
      if (!data?.userNotifUpdate?.id || errors) {
        notifications.show({
          color: 'red',
          message: prettyErrorPlaceholder(errors?.[0]?.code),
        });
        return;
      }
      await invalidate?.();
    });
  }, [invalidate, loading, user]);

  return (
    <>
      <div className="flex flex-col justify-center gap-4 border-t border-slate-200 py-4 sm:flex-row sm:items-center">
        <Button
          onClick={handleUnsub}
          loading={isLoading}
          size="compact-sm"
          variant="light"
          className="flex-shrink-0"
        >
          Unsubscribe
        </Button>
        <div className="text-sm text-slate-600">
          Click to disable all notification messages. You’ll still receive
          login/security emails.
        </div>
      </div>
    </>
  );
}
