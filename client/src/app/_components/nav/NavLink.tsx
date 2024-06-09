import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Children } from '@/util/propTypes';
import { clx } from '@/util/classConcat';

type NavLinkProps = {
  href: string;
  className?: string;
} & Partial<Parameters<typeof Link>[0]> &
  Children;

const NavLink = ({ href, children, className, ...props }: NavLinkProps) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={clx(
        'rounded-full bg-emerald-900/80 px-6 py-2 hover:bg-emerald-900 data-[here]:bg-emerald-950/80',
        className || '',
      )}
      data-here={path === href || null}
      {...props}
    >
      {children}
    </Link>
  );
};
export default NavLink;
