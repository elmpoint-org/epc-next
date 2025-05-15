import type { Metadata } from 'next';
import type { SearchParams } from '@/util/propTypes';

import SignupForm from './_components/SignupForm';
import A from '@/app/_components/_base/A';

export const metadata: Metadata = { title: 'Sign up' };

export default function RegisterPage({ searchParams }: SearchParams) {
  let initialEmail = searchParams.email;
  if (typeof initialEmail !== 'string') initialEmail = undefined;

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg font-black text-slate-500">
          Create your account
        </p>

        <div className="prose px-2.5 marker:prose-li:text-slate-400">
          <p>
            <b>EPC web accounts are invite-only,</b> to protect the privacy of
            our members.
          </p>
          <p>There are a few ways to get started with your account:</p>

          <ul>
            <li>
              <b>If you’re already on the EPC mailing list</b>, your account is
              already waiting for you! Type your email below to get started.
            </li>
            <li>
              Otherwise,{' '}
              <b>any current website member can send you an invitation</b>.
            </li>
          </ul>
        </div>

        <hr className="border-slate-300" />

        <SignupForm initialEmail={initialEmail} />

        <div className="t">
          <A href="login">I already have an account</A>
        </div>
      </div>
    </>
  );
}
