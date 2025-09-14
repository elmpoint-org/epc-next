import { Metadata } from 'next';

import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';
import TrustedWrapper from './_component/TrustedWrapper';
import ColorText from '@/app/_components/_base/ColorText';

export const metadata: Metadata = {
  title: 'Trusted Users - Account',
};

export default function AccountFamilyPage() {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
            Trusted Users
          </h1>
          <div className="container flex-1 rounded-lg bg-dwhite">
            <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-4 p-6">
              {/* leader text */}
              <p className="my-4">
                <span>Your </span>
                <ColorText>trusted users</ColorText>
                <span> </span>
                have your permission to edit your <b>
                  calendar reservations
                </b>{' '}
                and anything else you create on the site.
              </p>

              {/* members */}
              <TrustedWrapper />
            </div>
          </div>
        </div>
      </LoginBoundary>
    </>
  );
}
