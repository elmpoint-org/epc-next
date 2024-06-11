import { Metadata } from 'next';
import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';
import AccountDetails from './_components/AccountDetails';

export const metadata: Metadata = { title: 'Account Overview' };

export default function AccountPage() {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
            Account Overview
          </h1>

          <AccountDetails />
        </div>
      </LoginBoundary>
    </>
  );
}
