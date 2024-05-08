import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: '404 not found',
  },
};

export default function NotFoundPage() {
  return (
    <>
      <div className="container mx-auto flex flex-1 flex-col">
        <div className="m-6 flex flex-1 flex-col items-center justify-center text-xl text-red-800">
          not found
        </div>
      </div>
    </>
  );
}
