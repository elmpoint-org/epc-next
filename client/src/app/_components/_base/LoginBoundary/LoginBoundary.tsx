import { Children } from '@/util/propTypes';
import { type AuthUser, getUser } from '@/app/_ctx/user/provider';
import LoginBoundaryRedirect from './LoginBoundaryRedirect';
import ScopeError from './ScopeError';

/** redirect all users who aren't logged in */
export default async function LoginBoundary({
  scope,
  children,
}: { scope?: AuthUser['scope'] & {} } & Children) {
  const user = await getUser();

  if (!user) return <LoginBoundaryRedirect />;

  // check scope if requested
  scope?.push('ADMIN');
  const isAllowed = !scope
    ? true
    : scope.length > scope.filter((s) => !user.scope?.includes(s)).length;
  if (!isAllowed) return <ScopeError />;

  return <>{children}</>;
}
