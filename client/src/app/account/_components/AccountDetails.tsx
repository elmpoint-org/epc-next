'use client';

import { useUser } from '@/app/_ctx/user/context';
import Credentials from './Credentials';
import NewPasskey from './NewPasskey';

const AccountDetails = () => {
  const user = useUser();

  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">
          {`Welcome back${user?.name ? `, ${user.name}` : ''}!`}
        </h2>

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <Credentials />
          <NewPasskey />
        </div>
      </div>
    </>
  );
};
export default AccountDetails;
