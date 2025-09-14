import Link from 'next/link';

import { clmx } from '@/util/classConcat';

import { useIsHere } from './isHere';
import { NavLinkType } from './navTypes';
import { useNavLinkScopeCheck } from './isAllowed';

export const NAV_MAKE_SPACER = '___SPACER____';

type NavLinkProps = NavLinkType & {
  variant?: 'LIGHT';
} & Partial<Parameters<typeof Link>[0]>;

const NavLink = (item: NavLinkProps) => {
  const {
    href,
    icon: Icon,
    text,
    variant,
    exact,
    className,
    dontMatch,
    ...props
  } = item;

  const isHere = useIsHere([item], undefined, exact);

  // scope check
  const show = useNavLinkScopeCheck(item);
  if (!show) return null;

  // return spacer if requested
  if (typeof href === 'undefined' && text === NAV_MAKE_SPACER)
    return <hr className="mx-4 my-2 border-emerald-800 pb-px" />;

  return (
    <Link
      href={href ?? ''}
      onClick={(e) => {
        if (typeof href === 'undefined' && text === '') e.preventDefault();
      }}
      className={clmx(
        'flex flex-row items-center gap-5 rounded-full bg-emerald-900/80 px-5 py-2.5 hover:bg-emerald-900 data-here:bg-emerald-950/80',
        variant === 'LIGHT' && 'bg-dgreen hover:bg-emerald-700/50',
        className,
      )}
      data-here={isHere || null}
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
