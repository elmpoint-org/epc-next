import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconChevronLeft } from '@tabler/icons-react';

import type { IconTypeProps } from '@/util/iconType';
import type { NavDropdownType } from './navTypes';
import { clmx, clx } from '@/util/classConcat';
import { useIsHere } from './isHere';

import NavLink from './NavLink';
import { useNavLinkScopeCheck } from './isAllowed';

export default function NavLinkDropdown(item: NavDropdownType) {
  const { text, icon: Icon, links } = item;

  const [isOpen, { toggle, close, open }] = useDisclosure();

  const iconProps: IconTypeProps = {
    stroke: 2,
    className: clx('h-full'),
  };

  useIsHere(links, (h) => (h ? open() : close()));

  // scope check
  const show = useNavLinkScopeCheck(item);
  if (!show) return null;

  return (
    <>
      <div
        className="rounded-3xl bg-emerald-900/80 transition-all hover:bg-emerald-900 data-[o]:rounded-2xl"
        data-o={isOpen || null}
      >
        {/* parent button */}
        <button onClick={toggle} className="w-full">
          <div className="flex flex-row items-center gap-5 px-5 py-2.5 text-left">
            <div className={clmx('h-5', !!Icon && 'w-5', !Icon && '-mx-1')}>
              {Icon && <Icon className="h-full" />}
            </div>
            <div className="flex-1 leading-none">{text}</div>

            {/* closed icon */}
            <div className="size-5 text-white/35">
              {isOpen && <IconChevronDown {...iconProps} />}
              {!isOpen && <IconChevronLeft {...iconProps} />}
            </div>
          </div>
        </button>

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
