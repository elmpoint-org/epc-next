import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { Button, Kbd } from '@mantine/core';
import { useOs } from '@mantine/hooks';
import { useMemo } from 'react';

export type SaveState = 'UNSAVED' | 'SAVED' | 'SAVING';

export default function SaveRow({
  state,
  onClick,
}: {
  onClick?: () => void;
  state?: SaveState;
}) {
  const isSkeleton = useSkeleton();

  const os = useOs();
  const keys = useMemo<'MOBILE' | 'MAC' | 'STANDARD'>(() => {
    if (os === 'macos') return 'MAC';
    if (os === 'android' || os === 'ios') return 'MOBILE';
    return 'STANDARD';
  }, [os]);

  const BUTTON_TEXT = <>Save</>;

  return (
    <>
      <div className="flex flex-row items-center justify-end gap-2">
        {!isSkeleton ? (
          <>
            <div className="text-sm text-slate-600">
              {state === 'SAVED' && <>Changes saved</>}
              {state === 'SAVING' && <>Saving...</>}
              {state === 'UNSAVED' && (
                <>
                  {keys === 'MOBILE' ? (
                    <>Unsaved changes</>
                  ) : (
                    // show desktop shortcut
                    <>
                      <Kbd>{keys === 'MAC' ? `Cmd` : `Ctrl`}</Kbd> +{' '}
                      <Kbd>Enter</Kbd> to save
                    </>
                  )}
                </>
              )}
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                onClick?.();
              }}
              disabled={state === 'SAVED'}
              loading={state === 'SAVING'}
              size="compact-md"
            >
              {BUTTON_TEXT}
            </Button>
          </>
        ) : (
          <Button
            size="compact-md"
            disabled
            classNames={{
              root: 'animate-pulse bg-slate-200',
              inner: 'text-transparent',
            }}
          >
            {BUTTON_TEXT}
          </Button>
        )}
      </div>
    </>
  );
}
