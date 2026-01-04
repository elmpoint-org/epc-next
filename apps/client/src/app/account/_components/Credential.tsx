import { useMemo, useState } from 'react';

import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';

import { UserDataType, invalidateUserData } from '../_ctx/userData';
import type { Inside } from '@/util/inferTypes';
import { clx } from '@/util/classConcat';
import { oldGraphAuth, oldGraphError, graphql } from '@/query/graphql';
import { pkeyErrorMap } from '@/app/auth/passwordless';
import { confirmModal } from '@/app/_components/_base/modals';
import {
  PASSKEY_PROVIDERS_URL,
  PaskeyProviderMap,
  PasskeyProviderSchema,
} from '../_ctx/passkeyProviders';
import { dayjs } from '@epc/date-ts/dayjs';
import { useQuery } from '@tanstack/react-query';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';
import { Children } from '@/util/propTypes';

type Credential = Inside<(UserDataType & {})['credentials'] & {}>;

// COMPONENT
export function Credential(p: { credential?: Credential; order?: number }) {
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
            <div className="border-b pb-1 font-bold">
              {c.nickname || <span>Passkey</span>}
            </div>
            <div className="flex flex-col gap-2 py-1">
              {/* provider */}
              <div className="flex flex-col">
                <div className="text-xs uppercase text-slate-600">Saved in</div>
                <PasskeyProvider credential={c} />
              </div>

              {/* timestamps */}
              <div
                className="grid max-w-48 grid-flow-col text-xs"
                style={{ gridTemplateRows: 'auto auto' }}
              >
                {/* created */}
                <Timestamp datetime={c.createdAt}>Created</Timestamp>

                {/* last used */}
                <Timestamp datetime={c.lastUsedAt}>Last used</Timestamp>
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
        <PasskeyProvider credential={null} /> {/* prefetch provider info */}
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
            {p.name || 'unnamed passkey'}
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

function PasskeyProvider({ credential }: { credential: Credential | null }) {
  // get passkey providers
  const query = useQuery({
    queryKey: [PASSKEY_PROVIDERS_URL],
    async queryFn() {
      try {
        const resp = await fetch(PASSKEY_PROVIDERS_URL);
        if (!resp.ok) return null;
        const data = await resp.json();
        const providers: PaskeyProviderMap = new Map(
          Object.entries(data).map(
            ([k, v]) => [k, PasskeyProviderSchema.parse(v)], // pretier-ignore
          ),
        );
        return providers;
      } catch (_) {
        return null;
      }
    },
  });

  const provider = useMemo(
    () => query.data?.get(credential?.aaGuid?.toLowerCase() ?? ''),
    [credential?.aaGuid, query.data],
  );

  if (!credential) return null;
  return (
    <div className="mt-0.5 flex flex-row items-center gap-2 text-sm">
      {provider ? (
        <>
          {/* icon */}
          {!!provider.icon_light?.length && (
            <div
              className="size-4 bg-contain"
              style={{ backgroundImage: `url(${provider.icon_light})` }}
            />
          )}
          {/* name */}
          <div>{provider?.name ?? 'Unknown'}</div>
        </>
      ) : query.isPending ? (
        // skeleton
        <div className="flex h-5 animate-pulse flex-row items-center gap-2">
          <div className="-mr-0.5 size-4 rounded-md bg-slate-200" />
          <div className="h-3.5 w-32 rounded-full bg-slate-200" />
        </div>
      ) : (
        // failed to identify
        <div className="italic text-slate-400">unknown</div>
      )}
    </div>
  );
}

function Timestamp({
  datetime,
  children,
}: { datetime: string | null } & Children) {
  return (
    <>
      <div className="uppercase text-slate-600">{children}</div>
      {datetime ? (
        <div className="">
          {dayjs.utc(datetime).local().format('MMM D YYYY')}
          <br />
          <span className="">at </span>
          {dayjs.utc(datetime).local().format('h:mma')}
        </div>
      ) : (
        <div>
          <em className="text-slate-500">unknown</em>
          <br />
        </div>
      )}
    </>
  );
}
