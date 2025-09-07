import { Metadata } from 'next';

import MyEventsContainer from './_components/MyEvents';

export const metadata: Metadata = { title: 'My Stays' };

export default function MyStaysPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          My Stays
        </h1>
        <div className="container flex-1 rounded-lg bg-dwhite">
          <MyEventsContainer />
        </div>
      </div>
    </>
  );
}
