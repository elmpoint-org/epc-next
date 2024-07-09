import { Fragment } from 'react';

import { AppShell, ScrollArea } from '@mantine/core';

import { navLinks } from '@/sample-data/navLinksData';

import NavLink from './NavLink';
import NavLinkDropdown from './NavLinkDropdown';

const NavLinks = () => {
  return (
    <>
      <AppShell.Section
        grow
        renderRoot={(p) => (
          <ScrollArea
            {...p}
            classNames={{
              scrollbar: '!bg-transparent',
            }}
          />
        )}
      >
        <div className="flex flex-col space-y-2 p-2">
          {navLinks.map((it, i) => (
            <Fragment key={i}>
              {'links' in it ? (
                <NavLinkDropdown {...it} />
              ) : (
                <NavLink {...it} />
              )}
            </Fragment>
          ))}
        </div>
      </AppShell.Section>
    </>
  );
};
export default NavLinks;
