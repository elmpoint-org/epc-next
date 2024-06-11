'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'qs';

import { IconLoader2 } from '@tabler/icons-react';

export default function LoginBoundaryRedirect() {
  const router = useRouter();
  useEffect(() => {
    const tm = setTimeout(
      () =>
        router.push(
          `/auth/login?${qs.stringify({ to: window.location.href })}`,
        ),
      1,
    );
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="size-16 rounded-full p-2 text-dgreen">
            <IconLoader2 className="size-full animate-spin" stroke={1.5} />
          </div>
          <p className="text-center text-lg font-black text-slate-500">
            Redirecting to login...
          </p>
        </div>
      </div>
    </>
  );
}
