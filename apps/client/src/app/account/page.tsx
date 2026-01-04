import { Metadata } from 'next';
import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';
import AccountDetails from './_components/AccountDetails';
import AccountTitle from './_components/AccountTitle';
import Credentials from './_components/Credentials';
import InviteUser from './_components/InviteUser';
import LogOutAll from './_components/LogOutAll';
import ICSLinks from './_components/ICSLinks';

export const metadata: Metadata = { title: 'Account Overview' };

export default function AccountPage() {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
            Account Overview
          </h1>
          <div className="container flex-1 rounded-lg bg-dwhite">
            <AccountTitle />

            <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-4 sm:p-6">
              <AccountDetails />
              <hr className="t" />
              <Credentials />
              <hr className="t" />
              <InviteUser />
              <hr className="t" />
              <ICSLinks />

              {/*  */}
              <LogOutAll />
            </div>
          </div>
        </div>
      </LoginBoundary>
    </>
  );
}
