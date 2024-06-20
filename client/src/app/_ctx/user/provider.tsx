import { createHash } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';

import { type ResultOf } from '@graphql-typed-document-node/core';

import { type Children } from '@/util/propTypes';
import { type CookieOpts } from '@/util/cookies';
import { graph, graphql } from '@/query/graphql';

import { UserCtxProvider } from './context';

const GET_USER_FROM_AUTH = graphql(`
  query UserFromAuth {
    userFromAuth {
      id
      name
      firstName
      email
      scope
    }
  }
`);
export type AuthUser = NonNullable<
  ResultOf<typeof GET_USER_FROM_AUTH>['userFromAuth']
> & { avatarUrl?: string };

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

  // insert avatar url
  if (user) {
    const hash = createHash('sha256')
      .update(user.email.trim().toLowerCase())
      .digest('hex');
    (user as AuthUser).avatarUrl =
      `https://gravatar.com/avatar/${hash}?d=mp&s=256`;
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
