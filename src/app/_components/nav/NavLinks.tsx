import { AppShell, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import NavLink from './NavLink';

const NavBody = ({
  navState: [, { close }],
}: {
  navState: ReturnType<typeof useDisclosure>;
}) => {
  return (
    <>
      <AppShell.Section grow component={ScrollArea}>
        <div className="flex flex-col space-y-2">
          <NavLink href="/" onClick={close}>
            Home
          </NavLink>
          <NavLink href="/test" onClick={close}>
            Test
          </NavLink>
          <NavLink href="/calendar/new" onClick={close}>
            Calendar New Event
          </NavLink>

          {Array(16)
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
export default NavBody;
