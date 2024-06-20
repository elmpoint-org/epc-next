'use client';

import { useUser } from '@/app/_ctx/user/context';
import { graphAuth, graphql } from '@/query/graphql';
import { clx } from '@/util/classConcat';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useTransition } from 'react';

export default function LogOutAll() {
  const user = useUser();

  function confirmLogout() {
    modals.openConfirmModal(modalLogoutConfirm({ onConfirm: logoutAll }));
  }

  const [isLoading, loading] = useTransition();
  function logoutAll() {
    loading(async () => {
      if (!user) return;

      // send logout request
      const f = await graphAuth(
        graphql(`
          mutation UserResetSecret($id: ID!) {
            userResetSecret(id: $id) {
              id
            }
          }
        `),
        { id: user.id },
      ).catch(() => {
        notifications.show({
          color: 'red',
          message: 'Request failed. Try again.',
        });
        return false;
      });
      if (!f) return;

      window.location.reload();
    });
  }

  return (
    <>
      <div className="mt-36 flex flex-col justify-center gap-4 border-t border-slate-200 py-4 sm:flex-row sm:items-center">
        <Button
          onClick={confirmLogout}
          loading={isLoading}
          color="red"
          className="flex-shrink-0"
        >
          Log out all of your devices
        </Button>
        <div className="text-sm text-slate-600">
          Click to force every device that’s currently logged in to log in
          again.
        </div>
      </div>
    </>
  );
}

function modalLogoutConfirm(p: { onConfirm?: () => void }): ConfirmModalProps {
  return {
    title: <>Are you sure?</>,
    children: (
      <>
        <div className="mb-4 border-b border-slate-200" />

        <div className="prose prose-sm leading-normal">
          <p>
            Are you sure you want to log out <b>all of your devices</b>?
          </p>
          <p>
            You’ll need to log in again on every device, including this one.
          </p>
        </div>
        <div className="h-2"></div>
      </>
    ),
    labels: { confirm: 'Log out all devices', cancel: 'Cancel' },
    confirmProps: { color: 'red' },
    classNames: {
      content: clx('rounded-xl p-2'),
    },
    onConfirm: p.onConfirm,
  };
}

type ConfirmModalProps = Parameters<(typeof modals)['openConfirmModal']>[0];
