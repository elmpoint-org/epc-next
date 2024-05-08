import { AppShell, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCircleChevronDown,
  IconCircleChevronUp,
  IconUser,
} from '@tabler/icons-react';

const NavAccount = () => {
  const [isOpen, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell.Section className="rounded-lg bg-emerald-900">
        <Collapse in={isOpen}>
          <div className="space-y-2 p-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-dgreen h-10 rounded-full"></div>
              ))}
          </div>
        </Collapse>
        <button
          className="flex w-full flex-row items-center gap-2 rounded-lg bg-emerald-700/80 px-4 py-3 hover:bg-emerald-700"
          onClick={toggle}
        >
          <IconUser size={20} />
          <div className="flex-1 text-left">Michael Foster</div>

          {isOpen ? <IconCircleChevronDown /> : <IconCircleChevronUp />}
        </button>
      </AppShell.Section>
    </>
  );
};
export default NavAccount;
