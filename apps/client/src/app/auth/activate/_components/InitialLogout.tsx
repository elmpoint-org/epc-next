'use client';

import { useEffect } from 'react';

import { logout } from '@/app/_ctx/user/actions';
import { useUser } from '@/app/_ctx/user/context';

export default function InitialLogout() {
  const user = useUser();
  useEffect(() => {
    if (user) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
