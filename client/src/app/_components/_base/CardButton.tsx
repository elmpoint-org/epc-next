import { clmx } from '@/util/classConcat';
import { IconType } from '@/util/iconType';

export default function CardButton({
  icon: Icon,
  stroke,

  children,
  className,
  ...props
}: { icon: IconType; stroke?: number } & JSX.IntrinsicElements['button']) {
  return (
    <>
      <button
        className={clmx(
          'group flex flex-col items-center justify-center gap-2 rounded-md border border-transparent bg-emerald-500/10 p-5 text-emerald-700 transition hover:border-emerald-500 focus:outline-emerald-600',
          className,
        )}
        {...props}
      >
        <div className="-m-2 rounded-full p-2 transition ease-in-out group-hover:scale-110 group-hover:bg-white/30">
          <Icon className="size-10" stroke={stroke ?? 1.5} />
        </div>
        <div className="transition group-hover:translate-y-1.5">{children}</div>
      </button>
    </>
  );
}
