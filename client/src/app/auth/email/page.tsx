import { Suspense } from 'react';
import TokenVerifier from './_components/TokenVerifier';

export default function EmailAuthPage() {
  return (
    <>
      <Suspense>
        <TokenVerifier />
      </Suspense>
    </>
  );
}
