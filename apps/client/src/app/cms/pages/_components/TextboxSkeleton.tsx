import { TextInput } from '@mantine/core';

export default function TextboxSkeleton() {
  return (
    <>
      <div className="animate-pulse">
        <TextInput
          label=" "
          disabled
          classNames={{
            label: 'h-4 w-24 rounded-full bg-slate-200',
            input:
              'data-disabled:cursor-auto data-disabled:rounded-lg data-disabled:border-transparent data-disabled:bg-slate-200',
          }}
        />
      </div>
    </>
  );
}
