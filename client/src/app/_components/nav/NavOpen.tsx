import { IconMenu } from '@tabler/icons-react';

export default function NavOpen({ onClick }: { onClick?: () => unknown }) {
  return (
    <>
      <button
        className="fixed left-0 top-0 z-50 rounded-br-2xl bg-dwhite/30 p-4 transition-all hover:bg-dwhite/60 print:hidden"
        onClick={() => {
          onClick?.();
        }}
      >
        <IconMenu />
      </button>
    </>
  );
}
