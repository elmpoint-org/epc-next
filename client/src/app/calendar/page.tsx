import { Metadata } from 'next';

import Calendar from './_components/Calendar';

export const metadata: Metadata = {
  title: 'Calendar',
};

export default function CalendarPage() {
  return (
    <>
      <div className="page-full-width flex-1 rounded-lg bg-slate-100">
        <div className="mx-auto flex min-h-dvh flex-col gap-4 p-6">
          <Calendar />
        </div>
      </div>
    </>
  );
}
