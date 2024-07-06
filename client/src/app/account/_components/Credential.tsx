import { useState } from 'react';

import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';

import { UserDataType, invalidateUserData } from '../_ctx/userData';
import type { Inside } from '@/util/inferTypes';
import { clx } from '@/util/classConcat';
import { oldGraphAuth, oldGraphError, graphql } from '@/query/graphql';
import { pkeyErrorMap } from '@/app/auth/passwordless';
import { confirmModal } from '@/app/_components/_base/modals';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

// COMPONENT
export function Credential(p: {
  credential?: Inside<(UserDataType & {})['credentials'] & {}>;
  order?: number;
}) {
  const { credential: c, order } = p;
  const skeleton = !c;

  async function handleDelete() {
    const yes = await confirmDeleteModal({ name: c?.nickname ?? '' });
    if (yes) deletePasskey();
  }

  const [isDeleting, setIsDeleting] = useState(false);
  async function deletePasskey() {
    setIsDeleting(true);
    try {
      await oldGraphAuth(
        graphql(`
          mutation UserDeleteCredential($credentialId: ID!) {
            userDeleteCredential(id: $credentialId) {
              id
            }
          }
        `),
        {
          credentialId: c?.id || '',
        },
      );
    } catch (err: any) {
      notifications.show({
        color: 'red',
        title: 'Error',
        message: pkeyErrorMap(oldGraphError(err.response)),
      });
      return;
    }
    invalidateUserData();
    notifications.show({
      title: 'Success!',
      message: 'Successfully deleted that passkey.',
    });
  }

  return (
    <>
      <div
        className={clx(
          'relative flex min-w-56 flex-shrink-0 flex-col rounded-lg bg-dwhite p-3 shadow-md',
          // skeleton styles
          'data-[l]:h-44 data-[l]:animate-pulse data-[l]:shadow-sm',
        )}
        data-l={skeleton || null}
        style={
          skeleton
            ? {
                opacity: 1 - 0.14 * (order || 0),
              }
            : {}
        }
      >
        {c && (
          <>
            <div className="border-b pb-1 font-bold">{c.nickname}</div>
            <div className="flex flex-col gap-2 py-1">
              <div className="flex flex-col">
                <div className="text-xs uppercase text-slate-600">Created</div>
                <div className="text-sm">
                  {new Date(c.createdAt || 0).toDateString()}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-xs uppercase text-slate-600">
                  Last logged in from
                </div>
                <div className="text-sm">{c.device}</div>
              </div>
            </div>

            <div className="mt-2 flex flex-row justify-end border-t pt-1">
              <ActionIcon
                size="sm"
                color="red"
                variant="transparent"
                className="bg-slate-500/20 text-slate-500 transition-all hover:bg-red-600 hover:text-dwhite"
                onClick={handleDelete}
              >
                <IconTrash stroke={1.5} />
              </ActionIcon>
            </div>
          </>
        )}

        {isDeleting && <LoadingBlurFrame />}
      </div>
    </>
  );
}

function confirmDeleteModal(p: { name: string }) {
  return confirmModal({
    color: 'red',
    title: <>Delete this passkey?</>,
    children: (
      <>
        <div className="mb-2 border-y border-slate-200 py-3 text-sm text-slate-600">
          <span className="relative">To be deleted:&nbsp; “</span>
          <span className="-mx-2.5 -my-0.5 rounded-md bg-slate-200 px-2.5 py-0.5">
            {p.name}
          </span>
          <span>”</span>
        </div>
        <div className="prose prose-sm leading-normal">
          <p>
            Are you sure you want to delete this passkey? This can’t be undone.
          </p>
          <p>
            Doing this will prevent the passkey from being recognized anymore,
            but <b>you’ll still need to delete it off of your device</b>.
          </p>
        </div>
        <div className="h-2"></div>
      </>
    ),
    buttons: { confirm: 'Delete passkey', cancel: 'Don’t delete it' },
  });
}
