import { Children } from '@/util/propTypes';

import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';

export default function CalendarLayout({ children }: Children) {
  return (
    <>
      <LoginBoundary>{children}</LoginBoundary>
    </>
  );
}
