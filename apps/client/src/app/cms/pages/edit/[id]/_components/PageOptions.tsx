import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { EditFormProps } from './PageEditForm';
import { Switch } from '@mantine/core';

export default function PageOptions({ form, updateForm }: EditFormProps) {
  const isSkeleton = useSkeleton();

  return (
    <>
      <div
        className="group relative flex flex-col gap-4 rounded-[4px] border border-slate-300 p-3 px-4 data-s:border-transparent md:flex-row md:items-center md:gap-7"
        data-s={isSkeleton || null}
      >
        <p className="text-xs uppercase">options:</p>
        {(
          [
            ['publish', 'Publish page'],
            ['secure', 'Page requires login'],
            ['shouldAddContributor', 'Show me as a writer'],
          ] as [keyof typeof form, string][]
        ).map((it, i) => (
          <Switch
            key={i}
            checked={form[it[0]] as boolean}
            onChange={({ currentTarget: { checked: c } }) =>
              updateForm({ [it[0]]: c })
            }
            label={it[1] ?? it[0]}
            classNames={{
              input: 'peer',
              track:
                'not-peer-checked:border-slate-300 not-peer-checked:bg-slate-300',
              thumb: 'border-0',
              body: 'items-center',
            }}
          />
        ))}

        {isSkeleton && (
          <div className="absolute inset-0 bg-dwhite">
            <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-200" />
          </div>
        )}
      </div>
    </>
  );
}
