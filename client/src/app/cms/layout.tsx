import { Children } from '@/util/propTypes';
import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';

export default function CMSLayout({ children }: Children) {
  return (
    <>
      <LoginBoundary scope={['EDIT']}>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-center text-4xl">
            Content Manager
          </h1>
          {children}
        </div>
      </LoginBoundary>
    </>
  );
}
