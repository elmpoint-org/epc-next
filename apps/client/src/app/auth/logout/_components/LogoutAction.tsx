'use client';

import { useEffect, useMemo, useTransition } from 'react';

import { logout } from '@/app/_ctx/user/actions';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';
import { useUser } from '@/app/_ctx/user/context';
import { useRouter } from 'next/navigation';

export default function LogoutAction() {
  // on page load, send logout request
  const [, loading] = useTransition();
  useEffect(() => loading(logout), []);

  // notice when the user object disappears
  const user = useUser();
  useEffect(() => {
    if (!user) {
      if (window) {
        window.location.href = '/';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      {!user ? (
        // finished and about to redirect
        <>
          <div className="t">done! redirecting...</div>
        </>
      ) : (
        // stil loading
        <>
          <LoadingBlurFrame />
        </>
      )}
    </>
  );
}
