import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink = ({
  href,
  children,
  className,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Partial<Parameters<typeof Link>[0]>) => {
  const path = usePathname();

  return (
    <Link
      href={href}
      className={`rounded-full bg-emerald-900/80 px-6 py-2 hover:bg-emerald-900 data-[here]:bg-emerald-950/80 ${className}`}
      data-here={path === href || null}
      {...props}
    >
      {children}
    </Link>
  );
};
export default NavLink;
