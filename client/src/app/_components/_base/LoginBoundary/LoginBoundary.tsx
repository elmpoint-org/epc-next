import { Children } from '@/util/propTypes';
import { getUser } from '@/app/_ctx/user/provider';
import LoginBoundaryRedirect from './LoginBoundaryRedirect';

/** redirect all users who aren't logged in */
export default async function LoginBoundary({ children }: Children) {
  // await getuser
  const user = await getUser();

  // if no successful login, render redirect handler instead
  if (!user) return <LoginBoundaryRedirect />;

  // otherwise return the page
  return <>{children}</>;
}
