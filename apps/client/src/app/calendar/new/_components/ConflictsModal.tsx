import { IconAlertTriangle } from '@tabler/icons-react';
import { useCallback } from 'react';
import { confirmModal } from '@/app/_components/_base/modals';
import { EventIssue } from '../../_util/eventChecks';
import ConflictsList from './ConflictsList';

const ORDER = [
  'LONG_DATE_RANGE',
  'ROOM_CONFLICT',
  'MANAGED_CABIN',
  'ROOM_SHARING',
  'UNFINISHED_RES',
  'HIGH_CAPACITY',
] satisfies EventIssue.Kind[];
function sortIssues(issues: EventIssue.Generic[]) {
  return [...issues].sort((a, b) => {
    const aIndex = ORDER.indexOf(a.kind);
    const bIndex = ORDER.indexOf(b.kind);
    return aIndex - bIndex;
  });
}

export function useConflictsModal() {
  const runConflictsModal = useCallback((issues_: EventIssue.Generic[]) => {
    const issues = sortIssues(issues_);

    return confirmModal({
      title: (
        <>
          <IconAlertTriangle
            className="mx-2 -mt-1 inline size-5 text-amber-600"
            stroke={2}
          />{' '}
          Review these possible issues
        </>
      ),
      children: (
        <>
          <div className="mb-4 border-b border-slate-200" />

          <div className="flex flex-col gap-4 sm:px-4">
            <div className="prose prose-sm prose-slate my-2 max-w-none !leading-tight">
              <p>
                We found <b>{issues.length} issues</b> which might affect your stay.
              </p>
              <p>
                If all of these are as you intended, click the “Confirm and
                save” button at the bottom. Otherwise, you can go back and make
                changes now.
              </p>
            </div>

            <ConflictsList issues={issues} />
          </div>
          <div className="mt-4 border-b border-slate-200" />
        </>
      ),
      buttons: {
        cancel: 'Go back',
        confirm: 'Confirm and save',
      },
      color: 'emerald',
      width: 40 * 16,
      responsivePadding: true,
      focusOnConfirm: true,
    });
  }, []);

  return runConflictsModal;
}
