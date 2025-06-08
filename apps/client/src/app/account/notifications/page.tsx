import { Metadata } from 'next';

import ColorText from '@/app/_components/_base/ColorText';
import CalendarNotifs from './_components/CalendarNotifs';

export const metadata: Metadata = {
  title: 'Notification Settings - Account',
};

export default function NotificationsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Notification Settings
        </h1>

        <div className="container flex-1 rounded-lg bg-slate-100">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
            {/* leader text */}
            <p className="my-4">
              Choose which <ColorText>email notifications</ColorText> you’d like
              to receive below.
            </p>

            <CalendarNotifs />
          </div>
        </div>
      </div>
    </>
  );
}
