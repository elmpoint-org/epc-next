import { useSkeleton } from '@/app/_ctx/skeleton/context';

import A from '@/app/_components/_base/A';
import { EditFormProps } from '../edit/[id]/_components/PageEditForm';
import { IconEye } from '@tabler/icons-react';

export default function ViewPageLink({ serverPage }: EditFormProps) {
  const slug = serverPage?.slug ?? null;
  const isValid = slug?.length && slug.length > 0;

  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="group relative inline-block" data-s={isSkeleton || null}>
        <A
          href={`/pages/${slug ?? ''}`}
          aria-disabled={!isValid}
          target={isValid ? '_blank' : ''}
          rel={isValid ? 'noopener noreferrer' : ''}
          className="rounded-md p-0.5 aria-disabled:!cursor-auto aria-disabled:!bg-slate-200 aria-disabled:!text-slate-400"
          onClick={(e) => !isValid && e.preventDefault()}
        >
          <IconEye className="inline size-5 mb-px" />
          <span className="t"> view page</span>
        </A>

        {/* skeleton state */}
        <div className="invisible absolute inset-y-0 min-w-48 bg-dwhite group-data-[s]:visible">
          <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
      </div>
    </>
  );
}
