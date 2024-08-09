import Link from 'next/link';
import type { Children } from '@/util/propTypes';
import { clmx } from '@/util/classConcat';

const A = ({
  href,
  className,
  children,
  ...props
}: { href: string } & Children & Partial<Parameters<typeof Link>[0]>) => {
  return (
    <>
      <Link
        href={href}
        className={clmx(
          'font-bold text-emerald-700 hover:underline',
          className,
        )}
        {...props}
      >
        {children}
      </Link>
    </>
  );
};
export default A;
