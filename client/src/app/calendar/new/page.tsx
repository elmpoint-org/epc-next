import { Metadata } from 'next';

import NewEventForm from './_components/Form';

export const metadata: Metadata = {
  title: 'add your stay',
};

export default function CalendarNewPage() {
  return (
    <>
      <div className="flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">Add your stay</h2>

        <NewEventForm />
      </div>
    </>
  );
}
