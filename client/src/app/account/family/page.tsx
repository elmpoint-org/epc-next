import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';
import { Metadata } from 'next';
import { UserSearchBox } from '../_components/UserSearch';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

export const metadata: Metadata = {
  title: 'My Family',
};

export default function AccountFamilyPage() {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
            My Family
          </h1>
          <div className="container flex-1 rounded-lg bg-slate-100">
            <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
              {/* leader text */}
              <p className="my-4">
                <span>Your </span>
                <b className="bg-gradient-to-br from-emerald-500 to-emerald-800 bg-clip-text text-transparent">
                  family group
                </b>
                <span> </span>
                provides a way to share contact information and other data with{' '}
                <b>members of your household</b>.
              </p>

              {/* members */}
              <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
                {/* title */}
                <div className="flex flex-row items-center justify-between">
                  <h3 className="px-2 text-lg">Family Members</h3>

                  <div className="t">
                    <Button
                      size="compact"
                      color="slate"
                      justify="center"
                      variant="subtle"
                      leftSection={<IconPlus className="ml-3 size-4" />}
                    >
                      Add member
                    </Button>
                  </div>
                </div>

                {/* members list */}
                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex flex-col gap-2 p-2">
                    {Array(3)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-row items-center gap-3 rounded-md border border-slate-300 px-4 py-2"
                        >
                          <div
                            className="size-5 rounded-full bg-slate-300 bg-contain"
                            style={{ backgroundImage: `url(/mp.png)` }}
                          ></div>
                          <div className="t">Michael Foster</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LoginBoundary>
    </>
  );
}
