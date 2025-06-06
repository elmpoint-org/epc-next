import { IconCheck } from '@tabler/icons-react';

import { type SearchParams } from '@/util/propTypes';
import { tclient } from '@/query/trpc';

import StoreLoginAndRedirect from '../_components/StoreLoginAndRedirect';

export default async function EmailAutPage({ searchParams }: SearchParams) {
  let sp = await searchParams;
  const token = await verifyAuth(sp.token);
  const redirect = sp.to;

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

            <StoreLoginAndRedirect
              token={token}
              redirectTo={typeof redirect === 'string' ? redirect : undefined}
            />
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
