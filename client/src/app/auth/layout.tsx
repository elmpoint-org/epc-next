import type { Children } from '@/util/propTypes';

import Logo from '../_components/nav/Logo';
import Backdrop from './_components/Backdrop';

export default function AuthLayout({ children }: Children) {
  return (
    <>
      <>
        {/* backdrop */}
        <Backdrop />

        {/* content */}
        <div className="container z-10 mx-auto flex flex-1 flex-col items-center justify-center">
          {/* modal box */}
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-dblack/30 bg-slate-200 p-6 shadow-2xl">
            {/* logo panel */}
            <div className="rounded-lg bg-dgreen fill-dwhite px-12 py-4">
              <Logo className="w-full" />
            </div>

            <hr className="border-slate-300" />

            {/* page */}
            {children}
          </div>
        </div>
      </>
    </>
  );
}
