import { Metadata } from 'next';

import Calendar from './_components/Calendar';

export const metadata: Metadata = {
  title: 'Calendar',
};

export default function CalendarPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl print:hidden">
          Calendar
        </h1>

        <div className="page-full-width flex-1 rounded-lg bg-slate-100">
          <div className="mx-auto flex min-h-dvh flex-col gap-4 p-6">
            <Calendar />
          </div>
        </div>
      </div>
    </>
  );
}
