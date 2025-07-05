import { Metadata } from 'next';
import CabinsList from './_components/CabinsList';

export const metadata: Metadata = {
  title: 'Rooms & Cabins',
};

export default function RoomsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Rooms & Cabins
        </h1>
        <div className="container flex-1 rounded-lg bg-dwhite">
          <div className="mx-auto flex max-w-[32rem] flex-col gap-4 p-4 sm:p-6 md:max-w-none">
            <CabinsList />
          </div>
        </div>
      </div>
    </>
  );
}
