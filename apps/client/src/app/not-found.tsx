import { Metadata } from 'next';

import { Button } from '@mantine/core';
import Link from 'next/link';

export const metadata: Metadata = {
  title: {
    absolute: '404 not found',
  },
};

export default function NotFoundPage() {
  return (
    <>
      <div className="container mx-auto flex flex-1 flex-col">
        <div className="m-6 flex flex-1 flex-col items-center justify-center gap-4 text-xl text-red-800">
          <p className="t"> That page wasn’t found.</p>
          <div className="t">
            <Button
              component={Link}
              href="/"
              size="compact-md"
              variant="outline"
              color="red"
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
