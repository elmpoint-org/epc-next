import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react';

import type { IconTypeProps } from '@/util/iconType';
import type { NavDropdownType } from './navTypes';
import { clmx, clx } from '@/util/classConcat';
import { useIsHere } from './isHere';

import NavLink from './NavLink';
import { useNavLinkScopeCheck } from './isAllowed';
import { Children } from '@/util/propTypes';
import Link from 'next/link';
import { createElement } from 'react';

export default function NavLinkDropdown(item: NavDropdownType) {
  const { text, icon: Icon, links, href } = item;

  const [isOpen, { toggle, close, open }] = useDisclosure();

  const iconProps: IconTypeProps = {
    stroke: 2,
    className: clx('h-full w-auto'),
  };

  useIsHere(links, (h) => (h ? open() : close()));

  // scope check
  const show = useNavLinkScopeCheck(item);
  if (!show) return null;

  const isLink = typeof href === 'string';

  return (
    <>
      <div
        className="rounded-3xl bg-emerald-900/80 transition-all hover:bg-emerald-900 data-[o]:rounded-2xl"
        data-o={isOpen || null}
      >
        {/* parent button */}
        <ButtonOrLink
          className={clx('w-full', !isLink && 'group')}
          href={href}
          onClick={toggle}
        >
          <div className="flex flex-row items-center gap-5 px-5 py-2.5 text-left">
            <div className={clmx('h-5', !!Icon && 'w-5', !Icon && '-mx-1')}>
              {Icon && <Icon className="h-full" />}
            </div>
            <div className="flex-1 leading-none">{text}</div>

            {/* open/close button */}
            {createElement(
              isLink ? 'button' : 'div',
              {
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggle();
                },
                className: clx(
                  '-m-2.5 flex place-items-center p-2',
                  isLink && 'group',
                ),
              },
              <>
                <div className="rounded-full p-0.5 text-white/35 transition group-hover:bg-emerald-800/50 group-hover:text-slate-300">
                  <div className="size-5 ">
                    {isOpen && <IconChevronDown {...iconProps} />}
                    {!isOpen && <IconChevronLeft {...iconProps} />}
                  </div>
                </div>
              </>,
            )}
          </div>
        </ButtonOrLink>

        {/* dropdown list */}
        <Collapse in={isOpen}>
          <div className="flex flex-col gap-2 border-t border-white/10 p-4">
            {links.map((it, i) => (
              <NavLink key={i} {...it} variant="LIGHT" className="gap-4" />
            ))}
          </div>
        </Collapse>
      </div>
    </>
  );
}

/** if href is valid, a link will be rendered. */
function ButtonOrLink({
  children,
  className,
  href,
  onClick,
}: { className?: string; onClick?: () => void; href?: string } & Children) {
  const isLink = typeof href === 'string';

  return isLink ? (
    <Link {...{ className, href, onClick }}>{children}</Link>
  ) : (
    <button {...{ className, onClick }}>{children}</button>
  );
}
