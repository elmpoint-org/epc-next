'use client';

import { useEffect } from 'react';

import { login } from '@/app/_ctx/user/actions';
import { useLoginRedirect } from '../_util/loginRedirect';

export default function StoreLoginAndRedirect(p: {
  token: string;
  redirectTo?: string;
}) {
  // on load, store auth token
  useEffect(() => {
    login(p.token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLoginRedirect(p.redirectTo);

  return <></>;
}
