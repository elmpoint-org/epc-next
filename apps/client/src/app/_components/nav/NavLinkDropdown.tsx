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
import { ComponentPropsWithoutRef, createElement } from 'react';

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
          className={clx('w-full', !isLink ? 'group' : 'group/b')}
          href={href}
          onClick={isLink ? open : toggle}
        >
          <div className="flex flex-row-reverse items-center gap-5 px-5 py-2.5 text-left">
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
                  isLink && 'group peer',
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

            {/* link text */}
            <div className="flex-1 group-hover/b:[.peer:not(:hover)~&]:[--bg:0.7]">
              <span className="-mx-1.5 -my-0.5 block max-w-fit rounded-full bg-emerald-800/[var(--bg,0)] px-1.5 py-0.5 leading-none transition">
                {text}
              </span>
            </div>

            {/* icon  */}
            <div className={clmx('h-5', !!Icon && 'w-5', !Icon && '-mx-1')}>
              {Icon && <Icon className="h-full" />}
            </div>
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
function ButtonOrLink(
  props: ComponentPropsWithoutRef<'button'> & ComponentPropsWithoutRef<'a'>,
) {
  const { children, className, href, onClick } = props;

  const isLink = typeof href === 'string';

  return isLink ? (
    <Link {...{ className, href, onClick }}>{children}</Link>
  ) : (
    <button {...props}>{children}</button>
  );
}
