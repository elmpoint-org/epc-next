'use client';

import { Button, TextInput } from '@mantine/core';
import { useUserData } from '../_ctx/userData';
import { useUser } from '@/app/_ctx/user/context';
import { IconEdit } from '@tabler/icons-react';

const AccountDetails = () => {
  const initialUser = useUser();
  const user = useUserData();

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        {/* title */}
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Edit your profile</h3>
          <Button size="compact-md">Save</Button>
        </div>

        <div className=" flex flex-col gap-4 rounded-lg sm:flex-row sm:items-center">
          {/* avatar view */}
          <div className="flex flex-col items-center rounded-xl p-4">
            <a
              href="https://gravatar.com/profile"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative -m-2 rounded-full border border-slate-500 border-opacity-0 p-2 text-slate-500 hover:border-opacity-100"
            >
              <div
                className="size-36 rounded-full bg-slate-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${initialUser?.avatarUrl})` }}
              />
              <IconEdit className="invisible absolute right-0 top-0 size-6 p-1 group-hover:visible" />
            </a>
            <div className="flex flex-col items-center p-2 text-sm">
              <div className="font-bold">{user?.name ?? initialUser?.name}</div>
              <div className="t">{user?.email ?? initialUser?.email}</div>
            </div>
          </div>
          {/* text fields */}
          <div className="flex flex-1 flex-col gap-2 p-2">
            <TextInput label="Name" value={user?.name ?? ''} />
            <TextInput label="First Name" value={user?.firstName ?? ''} />
            <TextInput label="Email" value={user?.email ?? ''} />
          </div>
        </div>
      </div>
    </>
  );
};
export default AccountDetails;
