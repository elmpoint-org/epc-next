import { Checkbox } from '@mantine/core';
import { FileManagerProps } from './FileManager';

export default function SelectionActions({
  select,
  totalFiles,
}: {
  totalFiles?: number;
} & FileManagerProps) {
  const isChecked = !!select.count();
  const isPartial = select.count() !== totalFiles;

  return (
    <>
      <div className="flex flex-row justify-between rounded-md border border-transparent bg-slate-100 px-4 py-2">
        <div className="flex flex-row items-center gap-4">
          {/* total selected checkbox */}
          <Checkbox
            checked={isChecked}
            indeterminate={isChecked && isPartial}
            onChange={() => {
              if (!isPartial) select.selectNone();
              else select.selectAll();
            }}
            aria-label="select all"
          />

          <div className="text-sm text-slate-500">
            {select.count()} selected
          </div>
        </div>
      </div>
    </>
  );
}
