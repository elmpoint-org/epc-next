import { Metadata } from 'next';

import PagesQuery from './_components/home/PagesQuery';

export const metadata: Metadata = { title: 'Pages' };

// COMPONENT
export default function CMSPagesPage() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Pages
        </h1>
        <div className="container flex-1 rounded-lg bg-slate-100">
          {/* content */}
          <PagesQuery />
        </div>
      </div>
    </>
  );
}
