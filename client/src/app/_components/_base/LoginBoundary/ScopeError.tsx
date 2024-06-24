import { IconUserScan } from '@tabler/icons-react';

export default function ScopeError() {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-2">
          <div className="size-16 rounded-full p-2 text-red-600">
            <IconUserScan className="size-full" stroke={1.5} />
          </div>
          <h3 className="text-lg font-black text-slate-500">Access denied</h3>
          <p className='text-slate-800'>This page requires special permission to view.</p>
        </div>
      </div>
    </>
  );
}
