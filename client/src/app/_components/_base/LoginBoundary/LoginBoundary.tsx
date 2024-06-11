import { Children } from '@/util/propTypes';
import { getUser } from '@/app/_ctx/user/provider';
import LoginBoundaryRedirect from './LoginBoundaryRedirect';

/** redirect all users who aren't logged in */
export default async function LoginBoundary({ children }: Children) {
  const user = await getUser();

  if (!user) return <LoginBoundaryRedirect />;

  return <>{children}</>;
}
