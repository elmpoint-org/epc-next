'use client';

import { createContext, useContext, useEffect } from 'react';
import { AuthUser } from './provider';
import { Children } from '@/util/propTypes';
import { removeStoredToken } from './actions';

const ctx = createContext<AuthUser | null>(null);

export const UserCtxProvider = ({
  user,
  children,
}: { user: AuthUser | null } & Children) => {
  useEffect(() => {
    if (!user) removeStoredToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ctx.Provider value={user}>
        {/*  */}
        {children}
      </ctx.Provider>
    </>
  );
};

export const useUser = () => useContext(ctx);
