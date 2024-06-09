import { cookies } from 'next/headers';

import { IconCheck } from '@tabler/icons-react';

import { type SearchParams } from '@/util/propTypes';
import { tclient } from '@/query/trpc';
import { CookieOpts } from '@/util/cookies';
import StoreAndRedirect from './_components/StoreAndRedirect';

export default async function EmailAuthPage({ searchParams }: SearchParams) {
  const token = await verifyAuth(searchParams.token);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-6">
        {token ? (
          // success message
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="_bg-dgreen _text-slate-200 size-16 rounded-full p-2 text-dgreen">
                <IconCheck className="size-full" stroke={1.5} />
              </div>
              <p className="text-center text-lg font-black text-slate-500">
                Welcome back!
              </p>
            </div>

            <StoreAndRedirect token={token} />
          </>
        ) : (
          // failure message
          <>
            <div className="text-red-600">
              <p>request failed.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

async function verifyAuth(token?: unknown) {
  if (!(typeof token === 'string' && token.length)) return;

  // verify token
  const data = await tclient.auth.verifyPasskey
    .mutate({ token })
    .catch(() => {});
  if (!data) return;

  return data.token;
}
