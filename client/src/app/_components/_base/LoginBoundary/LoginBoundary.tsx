import { IconUserScan } from '@tabler/icons-react';

import type { Children } from '@/util/propTypes';
import { type AuthUser, getUser } from '@/app/_ctx/user/provider';
import { scopeCheck } from '@/util/scopeCheck';

import LoginBoundaryRedirect from './LoginBoundaryRedirect';
import PageError from '../PageError';

/** redirect all users who aren't logged in */
export default async function LoginBoundary({
  scope,
  children,
}: { scope?: AuthUser['scope'] & {} } & Children) {
  const user = await getUser();

  if (!user) return <LoginBoundaryRedirect />;

  // check scope if requested
  scope?.push('ADMIN');
  const isAllowed = !scope ? true : scopeCheck(user.scope, ...scope);
  if (!isAllowed)
    return (
      <PageError
        icon={IconUserScan}
        heading={<>Access denied</>}
        text={<>This page requires special permission to view.</>}
      />
    );

  return <>{children}</>;
}
