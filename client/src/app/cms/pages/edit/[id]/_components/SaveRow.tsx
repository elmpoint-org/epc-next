import { Button, Kbd } from '@mantine/core';

import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { useKeyboardKeys } from '@/util/keyboardKeys';

export type SaveState = 'UNSAVED' | 'SAVED' | 'SAVING' | 'TYPING';

export default function SaveRow({
  state,
  onClick,
}: {
  onClick?: () => void;
  state?: SaveState;
}) {
  const isSkeleton = useSkeleton();

  const keys = useKeyboardKeys();

  const BUTTON_TEXT = <>Save</>;

  return (
    <>
      <div className="flex flex-row items-center gap-2">
        {!isSkeleton ? (
          <>
            <div className="text-sm text-slate-600">
              {state === 'SAVED' && <>Changes saved</>}
              {state === 'SAVING' && <>Saving...</>}
              {state === 'TYPING' && <>Finish typing...</>}
              {state === 'UNSAVED' && (
                <>
                  {keys === 'MOBILE' ? (
                    <>Unsaved changes</>
                  ) : (
                    // show desktop shortcut
                    <>
                      <Kbd>{keys === 'MAC' ? `Cmd` : `Ctrl`}</Kbd> +{' '}
                      <Kbd>Shift</Kbd> +<Kbd>Enter</Kbd> to save
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
              disabled={state === 'SAVED' || state === 'TYPING'}
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
