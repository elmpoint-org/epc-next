import { RedirectType, redirect } from 'next/navigation';

import { Children } from '@/util/propTypes';
import { getUser } from '@/app/_ctx/user/provider';

/** redirect all users who aren't logged in */
export default async function LoginBoundary({ children }: Children) {
  // await getuser
  const user = await getUser();

  // TODO should either move this to middleware somehow or add a client component a nice visual so that current path can be returned to if linked
  if (!user) redirect(`/auth/login`, RedirectType.push);

  return <>{children}</>;
}
