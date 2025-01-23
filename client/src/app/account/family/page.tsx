import { Metadata } from 'next';

import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';
import FamilyMembers from './_component/FamilyMembers';

export const metadata: Metadata = {
  title: 'My Family Group',
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
                <b className="bg-gradient-to-br from-emerald-500 to-emerald-900 bg-clip-text text-transparent">
                  family group
                </b>
                <span> </span>
                provides a way to share contact information and other data with{' '}
                <b>members of your household</b>.
              </p>

              {/* members */}
              <FamilyMembers />

              {/* beta disclosure */}
              <div className="rounded-lg mt-8 border border-orange-600 bg-orange-400/20 p-4 text-sm text-orange-900">
                <h4 className="font-bold">
                  Features on this page are incomplete.
                </h4>
                <p className="pt-2">
                  Family groups will be enabled in a later update. For now,
                  these buttons are non-functional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </LoginBoundary>
    </>
  );
}
