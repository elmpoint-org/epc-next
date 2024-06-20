'use client';

import { useUser } from '@/app/_ctx/user/context';

export default function AccountTitle() {
  const user = useUser();

  return (
    <>
      <h2 className="p-6 text-center text-2xl">
        {`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}!`}
      </h2>
    </>
  );
}
