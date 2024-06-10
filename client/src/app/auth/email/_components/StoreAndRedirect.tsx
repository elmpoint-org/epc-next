'use client';

import { login } from '@/app/_ctx/user/actions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const REDIRECT_DELAY = 500;

export default function StoreAndRedirect(p: { token: string }) {
  const router = useRouter();
  useEffect(() => {
    login(p.token);
    const tm = setTimeout(() => router.push('/'), REDIRECT_DELAY);
    return () => clearTimeout(tm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
