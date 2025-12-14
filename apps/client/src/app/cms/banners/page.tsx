import LoginBoundary from '@/app/_components/_base/LoginBoundary/LoginBoundary';
import { Metadata } from 'next';
import BannersList from './_components/BannersList';

export const metadata: Metadata = {
  title: 'Homepage Alerts',
};

export default function CMSBannersPage() {
  return (
    <LoginBoundary scope={['EDIT']}>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Homepage Alerts
        </h1>
        <div className="container flex-1 rounded-lg bg-dwhite">
          <BannersList />
        </div>
      </div>
    </LoginBoundary>
  );
}
