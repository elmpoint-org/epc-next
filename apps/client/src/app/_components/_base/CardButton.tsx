import type { JSX } from 'react';
import { Transition } from '@headlessui/react';
import { IconLoader2 } from '@tabler/icons-react';

import { clmx, clx } from '@/util/classConcat';
import { IconType, IconTypeProps } from '@/util/iconType';

export default function CardButton({
  icon: Icon,
  stroke,
  loading,
  children,
  className,
  ...props
}: {
  icon: IconType;
  stroke?: number;
  loading?: boolean;
} & JSX.IntrinsicElements['button']) {
  const iconProps: IconTypeProps = {
    className: 'size-10',
    stroke: stroke ?? 1.5,
  };

  return (
    <>
      <button
        className={clmx(
          'group relative flex flex-col items-center justify-center rounded-md border border-transparent bg-emerald-500/10 p-5 text-emerald-700 transition focus:outline-emerald-600 data-[l]:cursor-default hover:data-[nl]:border-emerald-500',
          className,
        )}
        disabled={loading}
        data-l={loading || null}
        data-nl={!loading || null}
        {...props}
      >
        {/* button contents */}
        <div
          className={clx(
            'flex translate-y-0 flex-col items-center gap-2 transition',
            /* transition */ 'group-data-[l]:-translate-y-8 group-data-[l]:opacity-0',
          )}
        >
          <div className="-m-2 rounded-full p-2 transition ease-in-out group-hover:scale-110 group-hover:bg-white/30">
            <Icon {...iconProps} />
          </div>
          <div className="transition group-hover:translate-y-1.5">
            {children}
          </div>
        </div>

        {/* loader */}
        <Transition show={loading}>
          <div
            className={clx(
              'absolute inset-0 flex flex-col items-center justify-center',
              /* transition */ 'translate-y-0 transition data-[closed]:translate-y-8 data-[closed]:opacity-0',
            )}
          >
            <div className="animate-spin">
              <IconLoader2 {...iconProps} />
            </div>
          </div>
        </Transition>
      </button>
    </>
  );
}
