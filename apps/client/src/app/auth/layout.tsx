import type { Children } from '@/util/propTypes';

import LogoPanel from '@/app/_components/_base/LogoPanel';
import Backdrop from './_components/Backdrop';

export default function AuthLayout({ children }: Children) {
  return (
    <>
      <>
        {/* backdrop */}
        <Backdrop />

        {/* content */}
        <div className="z-10 container mx-auto flex flex-1 flex-col items-center justify-center">
          {/* modal box */}
          <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-dblack/30 bg-slate-200 p-6 shadow-2xl">
            {/* logo panel */}
            <LogoPanel />

            <hr className="border-slate-300" />

            {/* page */}
            {children}
          </div>
        </div>
      </>
    </>
  );
}
