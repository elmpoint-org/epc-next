import { Children } from '@/util/propTypes';
import { type AuthUser, getUser } from '@/app/_ctx/user/provider';
import LoginBoundaryRedirect from './LoginBoundaryRedirect';
import ScopeError from './ScopeError';
import { scopeCheck } from '@/util/scopeCheck';

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
  if (!isAllowed) return <ScopeError />;

  return <>{children}</>;
}
