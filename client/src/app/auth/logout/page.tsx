import LogoutAction from './_components/LogoutAction';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log out',
};

export default function LogoutPage() {
  return (
    <>
      <div className="relative flex h-36 flex-col items-center justify-center p-6">
        <LogoutAction />
      </div>
    </>
  );
}
