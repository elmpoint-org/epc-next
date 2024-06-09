import { UserDataType, useUserData } from '../_ctx/userData';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionIcon, ScrollArea } from '@mantine/core';
import { Inside } from '@/util/inferTypes';
import { clx } from '@/util/classConcat';
import { red } from 'tailwindcss/colors';

export default function Credentials() {
  const { data } = useUserData();
  const user = data?.userFromAuth;

  return (
    <>
      <div className="flex flex-col gap-2 rounded-md bg-slate-200 p-4">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Credentials</h3>

          <ActionIcon variant="white">
            <IconPlus />
          </ActionIcon>
        </div>

        <div className="">
          <ScrollArea scrollbars="x">
            <div className="flex flex-row gap-2">
              {user ? (
                user.credentials?.length ? (
                  <>
                    {user.credentials?.map((it, i) => (
                      <Credential key={it.id} credential={it} />
                    ))}
                  </>
                ) : (
                  <>
                    <div className="p-4 text-sm italic text-slate-500">
                      no passkeys found.
                    </div>
                  </>
                )
              ) : (
                <>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Credential key={i} order={i} />
                    ))}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
}

export function Credential(p: {
  credential?: Inside<(UserDataType & {})['credentials'] & {}>;
  order?: number;
}) {
  const { credential: c, order } = p;
  const skeleton = !c;

  return (
    <>
      <div
        className={clx(
          'my-3 flex flex-shrink-0 flex-col rounded-lg bg-dwhite p-3 shadow-md first:ml-3 last:mr-3',
          'data-[l]:h-24 data-[l]:w-44 data-[l]:animate-pulse data-[l]:shadow-sm',
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
            <div className="t">{c.device}</div>
            <div className="t">{new Date(c.createdAt || 0).toDateString()}</div>
            <div className="mt-2 flex flex-row justify-end border-t pt-1">
              <ActionIcon size="sm" color={red[700]}>
                <IconTrash stroke={1.5} />
              </ActionIcon>
            </div>
          </>
        )}
      </div>
    </>
  );
}
