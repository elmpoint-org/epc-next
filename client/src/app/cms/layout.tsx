import { Children } from '@/util/propTypes';
import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';

export default function CMSLayout({ children }: Children) {
  return (
    <>
      <LoginBoundary scope={['EDIT']}>
        <div className="flex flex-1 flex-col space-y-2">{children}</div>
      </LoginBoundary>
    </>
  );
}
