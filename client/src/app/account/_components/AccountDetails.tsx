'use client';

import { useUser } from '@/app/_ctx/user/context';
import Credentials from './Credentials';
import NewPasskey from './NewPasskey';
import InviteUser from './InviteUser';

const AccountDetails = () => {
  const user = useUser();

  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">
          {`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}!`}
        </h2>

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <Credentials />
          <NewPasskey />
          <hr className="t" />
          <InviteUser />
        </div>
      </div>
    </>
  );
};
export default AccountDetails;
