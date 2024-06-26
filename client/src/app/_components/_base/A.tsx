import Link from 'next/link';
import type { Children } from '@/util/propTypes';
import { clx } from '@/util/classConcat';

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
        className={clx('text-emerald-700 font-bold hover:underline', className)}
        {...props}
      >
        {children}
      </Link>
    </>
  );
};
export default A;
