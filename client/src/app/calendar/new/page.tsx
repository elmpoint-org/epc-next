import { Metadata } from 'next';

import NewEventForm from './_components/NewEventForm';

export const metadata: Metadata = {
  title: 'add your stay',
};

export default function CalendarNewPage() {
  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">Add your stay</h2>

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6 @container">
          <NewEventForm />
        </div>
      </div>
    </>
  );
}
