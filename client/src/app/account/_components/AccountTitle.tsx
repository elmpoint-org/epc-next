'use client';

import { useUserData } from '../_ctx/userData';

export default function AccountTitle() {
  const user = useUserData();

  return (
    <>
      <h2 className="p-6 text-center text-2xl">
        {`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}!`}
      </h2>
    </>
  );
}
