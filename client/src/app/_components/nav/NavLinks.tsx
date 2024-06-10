import { AppShell, ScrollArea } from '@mantine/core';

import NavLink from './NavLink';

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
          <NavLink href="/">Home</NavLink>
          <NavLink href="/test">Test</NavLink>
          <NavLink href="/calendar/new">Calendar - Add stay</NavLink>

          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                className="h-10 rounded-full bg-emerald-900/80"
                key={i}
              ></div>
            ))}
        </div>
      </AppShell.Section>
    </>
  );
};
export default NavLinks;
