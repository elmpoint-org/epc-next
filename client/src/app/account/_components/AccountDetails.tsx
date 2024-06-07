'use client';

import { useUser } from '@/app/_ctx/userState';

const AccountDetails = () => {
  const { user } = useUser();

  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">
          {`Welcome back${user ? `, ${user.name}` : ''}!`}
        </h2>

        <div className="h-[1000px] p-6">content</div>
      </div>
    </>
  );
};
export default AccountDetails;
