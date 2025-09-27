import { IconArrowRight } from '@tabler/icons-react';
import A from '../_base/A';

export default function HomeBanner() {
  return (
    <>
      <div className="mx-2 -mt-4 flex flex-col items-center rounded-lg border border-emerald-600 bg-emerald-500/30 px-4 py-2 text-emerald-900 md:flex-row md:gap-4">
        <p className="flex-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae a
          laudantium beatae.
        </p>
        <div className="self-end md:self-auto">
          <A href={''}>
            Action <IconArrowRight className="-mt-0.5 inline size-4" />
          </A>
        </div>
      </div>
    </>
  );
}
