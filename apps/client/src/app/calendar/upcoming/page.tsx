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
        <div className="container flex-1 rounded-lg bg-dwhite">
          <MyEventsList />
        </div>
      </div>
    </>
  );
}
