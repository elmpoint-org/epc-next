'use client';

import {
  ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActionIcon, Button, Switch, Tooltip } from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import { Children } from '@/util/propTypes';
import { clx } from '@/util/classConcat';
import fdeq from 'fast-deep-equal';

import { NOTIF_DEFAULT_VALUES } from '@epc/notif-opts/defaults';
import { NotifsProps, NotifsType } from './NotifWrapper';
import { useLoading } from '@/util/useLoading';
import { graphAuth, graphql } from '@/query/graphql';
import { useUser } from '@/app/_ctx/user/context';
import { notifications } from '@mantine/notifications';
import { prettyErrorPlaceholder } from '@/util/prettyErrors';
import { useNotifInvalidate } from '../_ctx/notifInvalidate';

export default function CalendarNotifs(props: NotifsProps) {
  const { notifs: serverNotifs, isPending } = props;

  const user = useUser();

  const serverNotifsWithDefaults = useMemo(() => {
    const merged = { ...serverNotifs };
    const keys = Object.keys(NOTIF_DEFAULT_VALUES) as Array<
      keyof typeof NOTIF_DEFAULT_VALUES
    >;

    for (const key of keys) {
      console.log(key, merged[key]);
      if (serverNotifs?.UNSUBSCRIBED) {
        merged[key] = false;
      } else if (typeof merged[key] !== 'boolean') {
        merged[key] = NOTIF_DEFAULT_VALUES[key];
      }
    }
    return merged as NotifsType;
  }, [serverNotifs]);

  // notif state
  const [notifs, setNotifs] = useState<NotifsType>(serverNotifsWithDefaults);
  useEffect(() => {
    if (serverNotifsWithDefaults && !fdeq(notifs, serverNotifsWithDefaults))
      setNotifs(serverNotifsWithDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverNotifsWithDefaults]);

  // save status
  const [isLoading, loading] = useLoading();
  const invalidate = useNotifInvalidate();
  const status = useMemo<BoxStatus>(() => {
    if (isLoading) return 'LOADING';
    if (!fdeq(notifs, serverNotifsWithDefaults)) return 'UNSAVED';
    return 'SAVED';
  }, [isLoading, notifs, serverNotifsWithDefaults]);

  const handleSave = useCallback(() => {
    loading(async () => {
      if (!user) return;

      const diffNotifs: Partial<NotifsType> = {};
      const keys = Object.keys(serverNotifsWithDefaults) as Array<
        keyof NotifsType
      >;
      for (const key of keys) {
        if (notifs[key] !== serverNotifsWithDefaults[key])
          diffNotifs[key] = notifs[key];
      }

      // if new subscriptions, disable unsubscribe
      if (serverNotifs?.UNSUBSCRIBED === true && Object.keys(diffNotifs).length)
        diffNotifs.UNSUBSCRIBED = false;

      const { data, errors } = await graphAuth(
        graphql(`
          mutation UserNotifUpdate($id: ID!, $notifs: UserNotifInput!) {
            userNotifUpdate(id: $id, notifs: $notifs) {
              id
            }
          }
        `),
        {
          id: user.id,
          notifs: diffNotifs,
        },
      );

      if (errors || !data?.userNotifUpdate?.id) {
        notifications.show({
          color: 'red',
          message: prettyErrorPlaceholder(errors?.[0]?.code),
        });
        return;
      }
      await invalidate?.();
    });
  }, [
    invalidate,
    loading,
    notifs,
    serverNotifs?.UNSUBSCRIBED,
    serverNotifsWithDefaults,
    user,
  ]);

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        {/* title */}
        <div className="flex flex-row items-center justify-between gap-2 px-2">
          <h3 className="text-lg">Calendar notifications</h3>
          <SaveReset
            status={status}
            onRevert={() => setNotifs(serverNotifsWithDefaults)}
            onSave={handleSave}
          />
        </div>

        {/* members list */}
        <div className="mt-2 flex flex-col gap-4 px-4 py-2">
          <OptionSwitch
            checked={notifs['calendarStayReminder'] || false}
            isLoading={isPending}
            onChange={({ currentTarget: { checked: c } }) =>
              setNotifs((n) => ({ ...n, ['calendarStayReminder']: c }))
            }
            label={<>Reservation reminders (1 week before)</>}
            description={
              <span>
                Get a reminder a week before your stay to make sure your
                reservation is still accurate.
              </span>
            }
          />
        </div>
      </div>
    </>
  );
}

function OptionSwitch({
  classNames: _,
  children,
  isLoading,
  ...props
}: { isLoading?: boolean } & ComponentPropsWithoutRef<typeof Switch> &
  Children) {
  return (
    <Switch
      {...props}
      label={children ?? props.label}
      color={isLoading ? 'white' : 'emerald'}
      disabled={isLoading}
      className="![--label-offset-start:1rem]"
      classNames={{
        input: 'peer',
        track: clx(
          'relative [.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
          isLoading &&
            'animate-pulse !border-slate-200 after:absolute after:inset-0 after:z-10 after:bg-slate-200/80',
        ),
        thumb: 'border-0',
        body: 'items-center',
        description: 'space-y-1 leading-tight *:block',
      }}
    />
  );
}

export type BoxStatus = 'SAVED' | 'UNSAVED' | 'LOADING';
function SaveReset({
  status,
  onRevert,
  onSave,
}: {
  status: BoxStatus;
  onRevert?: () => void;
  onSave?: () => void;
}) {
  return (
    <>
      {/* form action buttons */}
      <div className="flex flex-row items-center gap-2">
        <Tooltip label="Reset to saved">
          <ActionIcon
            aria-label="reset to saved"
            variant="subtle"
            className="data-[disabled]:invisible"
            disabled={status !== 'UNSAVED'}
            onClick={onRevert}
          >
            <IconRestore className="h-5" />
          </ActionIcon>
        </Tooltip>
        <Button
          type="submit"
          size="compact-md"
          disabled={status !== 'UNSAVED'}
          loading={status === 'LOADING'}
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </>
  );
}
