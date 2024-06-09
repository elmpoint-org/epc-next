'use client';

import { createContext, useContext } from 'react';
import { AuthUser } from './provider';
import { Children } from '@/util/propTypes';

const ctx = createContext<AuthUser | null>(null);

export const UserCtxProvider = ({
  user,
  children,
}: { user: AuthUser | null } & Children) => {
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
