import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clmx } from '@/util/classConcat';

import type { IconType } from '@/util/iconType';

export type NavLinkType = {
  href: string;
  text: React.ReactNode;
  icon?: IconType;
};

type NavLinkProps = NavLinkType & Partial<Parameters<typeof Link>[0]>;

const NavLink = ({
  href,
  icon: Icon,
  text,
  className,
  ...props
}: NavLinkProps) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={clmx(
        'flex flex-row items-center gap-5 rounded-full bg-emerald-900/80 px-5 py-2.5 hover:bg-emerald-900 data-[here]:bg-emerald-950/80',
        className,
      )}
      data-here={path === href || null}
      {...props}
    >
      <div className={clmx('h-5', !!Icon && 'w-5', !Icon && '-mx-1')}>
        {Icon && <Icon className="h-full" />}
      </div>
      <div className="flex-1 leading-none">{text}</div>
    </Link>
  );
};
export default NavLink;
