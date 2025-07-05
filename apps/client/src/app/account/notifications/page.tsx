import { Metadata } from 'next';

import NotifWrapper from './_components/NotifWrapper';
import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';

export const metadata: Metadata = {
  title: 'Notification Settings - Account',
};

export default function NotificationsPage() {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
            Notification Settings
          </h1>

          <div className="container flex-1 rounded-lg bg-dwhite">
            <div className="mx-auto max-w-screen-lg p-6">
              <NotifWrapper />
            </div>
          </div>
        </div>
      </LoginBoundary>
    </>
  );
}
