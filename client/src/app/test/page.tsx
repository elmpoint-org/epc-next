import { Metadata } from 'next';

export const metadata: Metadata = {
title: 'test page',
};

export default function TestPage() {
    return (
    <>
            <div className="container mx-auto flex flex-1 flex-col">
        <div className="m-6 flex flex-1 flex-col items-center justify-center text-4xl">
          test page
        </div>
      </div>
    </>
  );
}
