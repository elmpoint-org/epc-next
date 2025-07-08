import { clmx } from '@/util/classConcat';
import { IconChevronsLeft, IconMenu } from '@tabler/icons-react';

export default function NavControl({
  isDesktop,
  isOpen,
  className,
  ...props
}: {
  isDesktop: boolean;
  isOpen?: boolean;
} & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <>
      <button
        aria-label="navbar open/close"
        className={clmx(
          'fixed left-0 top-0 z-[51] rounded-br-2xl bg-dwhite/30 p-4 transition-all hover:bg-dwhite/60 print:hidden',
          className,
        )}
        {...props}
      >
        {!isDesktop || !isOpen ? <IconMenu /> : <IconChevronsLeft />}
      </button>
    </>
  );
}
