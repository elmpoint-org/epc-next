import { cookies } from 'next/headers';
import { type ResultOf } from '@graphql-typed-document-node/core';

import { type Children } from '@/util/propTypes';
import { type CookieOpts } from '@/util/cookies';
import { graph, graphql } from '@/query/graphql';

import { UserCtxProvider } from './context';
import { cache } from 'react';

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

export async function getUser() {
  // get stored auth token
  const token = cookies().get('USER_AUTH' as CookieOpts);
  if (!token) return null;

  // verify token and get user info
  const data = await authorizeUser(token.value);
  if (!data?.userFromAuth) return false;

  return data.userFromAuth;
}

export const authorizeUser = cache(async (token: string) =>
  graph
    .request(GET_USER_FROM_AUTH, {}, { authorization: `Bearer ${token}` })
    .catch(() => {}),
);

export async function UserProvider({ children }: Children) {
  let user = await getUser();

  // request token removal if token was invalid (NOT if it just didn't exist)
  let removeToken: boolean = false;
  if (user === false) {
    user = null;
    removeToken = true;
  }

  return (
    <>
      <UserCtxProvider user={user} removeToken={removeToken}>
        {/*  */}
        {children}
      </UserCtxProvider>
    </>
  );
}
