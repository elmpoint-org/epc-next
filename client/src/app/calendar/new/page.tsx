import { Metadata } from 'next';

import NewEventForm from './_components/NewEventForm';
import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';

export const metadata: Metadata = {
  title: 'add your stay',
};

export default function CalendarNewPage() {
  return (
    <>
      <LoginBoundary>
        <div className="@container flex-1 rounded-lg bg-slate-100">
          <h2 className="p-6 text-center text-2xl">Add your stay</h2>

          <NewEventForm />
        </div>
      </LoginBoundary>
    </>
  );
}
