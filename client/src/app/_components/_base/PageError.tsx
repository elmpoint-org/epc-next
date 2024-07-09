import { ReactNode } from 'react';

import type { IconType } from '@/util/iconType';

type PageErrorProps = {
  icon: IconType;
  heading: ReactNode;
  text: ReactNode;
};

export default function PageError({
  icon: Icon,
  heading,
  text,
}: PageErrorProps) {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-800">
          <div className="size-16 rounded-full p-2 text-red-600">
            <Icon className="size-full" stroke={1} />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <h3 className="text-xl">{heading}</h3>
            <p className="text-slate-500">{text}</p>
          </div>
        </div>
      </div>
    </>
  );
}
