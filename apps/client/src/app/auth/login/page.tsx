import A from '@/app/_components/_base/A';
import LoginForm from './_components/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in',
};

export default function LoginPage() {
  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg font-black text-slate-500">
          Welcome back! Log in below.
        </p>

        <LoginForm />

        <div className="t">
          Still need to <A href="register">create your account</A>?
        </div>
      </div>

      {/*  */}
    </>
  );
}
