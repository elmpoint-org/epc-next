import ColorText from '@/app/_components/_base/ColorText';
import { Metadata } from 'next';
import MyEventsList from './_components/MyEventsList';

export const metadata: Metadata = { title: 'My Upcoming Stays' };

export default function MyStaysPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          My Upcoming Stays
        </h1>
        <div className="container flex-1 rounded-lg bg-slate-100">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
            {/* instructions */}
            <p className="my-4">
              Your current and upcoming{' '}
              <ColorText>calendar reservations</ColorText> are listed below.
              Click to view and edit reservation details.
            </p>

            {/* events list */}
            <MyEventsList />
          </div>
        </div>
      </div>
    </>
  );
}
