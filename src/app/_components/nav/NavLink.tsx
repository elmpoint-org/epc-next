import Link from 'next/link';

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
  return (
    <Link
      href={href}
      className={`rounded-full bg-emerald-900/80 px-6 py-2 hover:bg-emerald-900 ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};
export default NavLink;
