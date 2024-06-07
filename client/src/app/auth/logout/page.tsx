'use client';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';
import { useLogout, useUser } from '@/app/_ctx/userState';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LogoutPage = () => {
  const router = useRouter();

  const logout = useLogout();
  const { user } = useUser();
  useEffect(
    () => logout(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    if (!user) router.back();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <div className="relative flex h-36 flex-col items-center justify-center p-6">
        {/* loading state */}
        <LoadingBlurFrame />
      </div>
    </>
  );
};
export default LogoutPage;
