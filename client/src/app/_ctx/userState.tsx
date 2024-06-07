import { createContext, useContext } from 'react';
import { ResultOf } from '@graphql-typed-document-node/core';

import { graphql } from '@/query/graphql';
import { queryClient, useGraphQuery } from '@/query/query';
import { Children } from '@/util/childrenType';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import cookies from '@/util/cookies';
import { UseQueryResult } from '@tanstack/react-query';
import { GLOBAL_RETRIES } from '@/CONSTANTS';
import { Portal } from '@mantine/core';

// USER AUTH STATE

const authState = atom<string>({
  key: 'AuthState',
  default: (cookies.get('USER_AUTH') as string) || '',
});

export const useAuth = () => useRecoilValue(authState);

export const useLogin = () => {
  const [, set] = useRecoilState(authState);
  return (token: string) => {
    cookies.set('USER_AUTH', token);
    set(token);
  };
};
export const useLogout = () => {
  const [, set] = useRecoilState(authState);
  return () => {
    cookies.remove('USER_AUTH');
    set('');
  };
};

// GET USER INFO CTX

const GET_USER_FROM_AUTH = graphql(`
  query UserFromAuth {
    userFromAuth {
      id
      name
      email
      scope
    }
  }
`);

export type AuthUser = NonNullable<
  ResultOf<typeof GET_USER_FROM_AUTH>['userFromAuth']
>;

const UserCtx = createContext<{
  user: AuthUser | null;
  query: Partial<UseQueryResult>;
}>({ user: null, query: {} });

export const UserProvider = ({ children }: Children) => {
  const auth = useAuth();
  const query = useGraphQuery(GET_USER_FROM_AUTH, null, {
    addToKey: auth,
    headers: () => ({ authorization: `Bearer ${auth}` }),
    retry: (count, err) => {
      const msg = (err as any)?.response?.errors?.[0]?.extensions?.code;
      if (msg === 'NEED_PERMISSION') return false;
      return count < GLOBAL_RETRIES;
    },
  });
  const user = query.data?.userFromAuth || null;

  return (
    <>
      <UserCtx.Provider value={{ user, query }}>
        {/*  */}
        {children}
      </UserCtx.Provider>
    </>
  );
};

export const useUser = () => useContext(UserCtx);

export const useUserRefetch = () => {
  const auth = useAuth();
  return () =>
    queryClient.invalidateQueries({
      queryKey: [GET_USER_FROM_AUTH, null, auth],
    });
};
