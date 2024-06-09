'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { IconCheck } from '@tabler/icons-react';

import { trpc } from '@/query/trpc';
import cookies from '@/util/cookies';

import LoadingBlurFrame from '@/app/_components/_base/LoadingBlurFrame';

const REDIRECT_DELAY = 200;

const TokenVerifier = () => {
  const [isLoading, loading] = useTransition();
  const [isRendering, setIsRendering] = useState(true);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const search = useSearchParams();
  const router = useRouter();

  // verify token
  const verifyFn = trpc.auth.verifyPasskey.useMutation();
  useEffect(() => {
    setIsRendering(false);
    const token = search.get('token');
    if (!token?.length) return;

    loading(async () => {
      const data = await verifyFn.mutateAsync({ token }).catch((e) => {
        setFailed(true);
      });
      if (!data) return;

      // store auth token
      cookies.set('USER_AUTH', data.token);
      setSuccess(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // redirect on success
  useEffect(() => {
    let tm: ReturnType<typeof setTimeout>;
    if (success) tm = setTimeout(() => router.push('/'), REDIRECT_DELAY);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-6">
        {failed && (
          <div className="text-red-600">
            <p>request failed.</p>
          </div>
        )}
        {/* success message */}
        <div
          className="flex flex-col items-center gap-2 data-[hidden]:invisible"
          data-hidden={!success || null}
        >
          <div className="_bg-dgreen _text-slate-200 size-16 rounded-full p-2 text-dgreen">
            <IconCheck className="size-full" stroke={1.5} />
          </div>
          <p className="text-center text-lg font-black text-slate-500">
            Welcome back!
          </p>
        </div>

        {/* loading state */}
        {(isRendering || isLoading) && <LoadingBlurFrame />}
      </div>
    </>
  );
};
export default TokenVerifier;
