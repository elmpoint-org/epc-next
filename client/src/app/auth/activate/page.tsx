import type { SearchParams } from '@/util/propTypes';
import { tclient } from '@/query/trpc';

import CreateAccountForm from './_components/CreateAccountForm';
import { IconCheck } from '@tabler/icons-react';
import InitialLogout from './_components/InitialLogout';
import ActivationBoundary from './_components/ActivationBoundary';

export default async function ActivationPage({ searchParams }: SearchParams) {
  const preUser = await verifyToken(searchParams.token);

  return (
    <>
      <ActivationBoundary enable={!!preUser}>
        <div className="flex flex-col gap-4">
          <h2 className="text-center text-lg font-black text-slate-500">
            Finish creating your account
          </h2>

          <div className="flex flex-row items-center gap-2 self-center text-emerald-800">
            <IconCheck />
            <span className="t">You’ve succesfully verified your email!</span>
          </div>

          <hr className="border-slate-300" />

          <CreateAccountForm
            preUser={preUser ?? { name: '', email: '' }}
            token={searchParams.token as string}
          />
        </div>

        <InitialLogout />
      </ActivationBoundary>
    </>
  );
}

async function verifyToken(token: unknown) {
  if (!(typeof token === 'string' && token.length)) return;

  return tclient.register.verifyToken.mutate({ token }).catch(() => null);
}
