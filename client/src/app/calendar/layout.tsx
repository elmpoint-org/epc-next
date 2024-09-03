import { Children } from '@/util/propTypes';

import LoginBoundary from '../_components/_base/LoginBoundary/LoginBoundary';

export default function CalendarLayout({ children }: Children) {
  return (
    <>
      <LoginBoundary>
        <div className="flex flex-1 flex-col space-y-2">
          <h1 className="mb-6 flex flex-col items-center justify-center text-4xl print:hidden">
            Calendar
          </h1>

          {children}
        </div>
      </LoginBoundary>
    </>
  );
}
