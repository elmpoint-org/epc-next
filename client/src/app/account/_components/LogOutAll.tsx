'use client';

import { useTransition } from 'react';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { confirmModal } from '@/app/_components/_base/modals';
import { useUser } from '@/app/_ctx/user/context';
import { graphAuth, graphql } from '@/query/graphql';

export default function LogOutAll() {
  const user = useUser();

  async function confirmLogout() {
    const yes = await confirmLogoutModal();
    if (yes) logoutAll();
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

function confirmLogoutModal() {
  return confirmModal({
    color: 'red',
    title: <>Are you sure?</>,
    body: (
      <>
        <p>
          Are you sure you want to log out <b>all of your devices</b>?
        </p>
        <p>You’ll need to log in again on every device, including this one.</p>
      </>
    ),
    buttons: { confirm: 'Log out all devices' },
  });
}
