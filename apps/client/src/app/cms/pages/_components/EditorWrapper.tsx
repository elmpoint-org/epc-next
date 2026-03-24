import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { EditFormProps } from '../edit/[id]/_components/PageEditForm';
import { lazy, Suspense, useEffect, useMemo } from 'react';

const editorPrefetch = () => import('./Editor');
const TextEditor = lazy(editorPrefetch);

export default function EditorWrapper({ ...props }: EditFormProps) {
  const isSkeleton = useSkeleton();
  const isReady = useMemo(() => !isSkeleton, [isSkeleton]);

  useEffect(() => {
    editorPrefetch();
  }, []);

  return (
    <div className="relative min-h-48">
      {isReady ? (
        <Suspense fallback={<EditorSkeleton />}>
          <TextEditor {...props} />
        </Suspense>
      ) : (
        <EditorSkeleton />
      )}
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="absolute inset-[-1px] z-50 bg-dwhite">
      <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-200"></div>
    </div>
  );
}
