import { IconAlertTriangle } from '@tabler/icons-react';
import { useCallback, useMemo } from 'react';
import { useFormCtx } from '../state/formCtx';
import { CUSTOM_ROOM_ID } from '@epc/types/cabins';
import { confirmModal } from '@/app/_components/_base/modals';
import { EventIssue } from '../../_util/eventChecks';

export function useConflictsModal() {
  const { guests } = useFormCtx();
  const aa = useMemo(() => {
    for (const {
      room: { room },
    } of guests) {
      if (!room || room.id === CUSTOM_ROOM_ID) continue;

      // if(room.availableBeds < room.)
    }
  }, [guests]);

  const runConflictsModal = useCallback((issues: EventIssue.Generic[]) => {
    console.log('ISSUES:', issues);
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

          <div className="flex flex-col gap-4 px-4">
            <div className="prose prose-sm prose-slate my-2 max-w-none !leading-tight">
              <p>Please double check the list of concerns below.</p>
              <p>
                If everything looks good to you, click the “Confirm and save”
                button. Otherwise, you can go back and make changes.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {issues.map((issue, i) => (
                <div
                  key={i}
                  className="rounded-md border border-slate-300 bg-slate-200 p-2 text-sm"
                >
                  <div className="flex flex-row items-center gap-2">
                    <span className="text-xs font-bold uppercase">
                      {issue.kind.replace(/_/g, ' ')}
                    </span>
                    <span className="t">
                      {'cabin' in issue && <>{issue.cabin.name}</>}
                      {'room' in issue && (
                        <>
                          {issue.room.cabin ? (
                            <>{issue.room.cabin.name} - </>
                          ) : null}
                          {issue.room.name} (
                          {issue.reservations.map((c) => c.name).join(', ')})
                        </>
                      )}

                      {issue.kind === 'LONG_DATE_RANGE' && (
                        <>{issue.diff} days</>
                      )}

                      {issue.kind === 'UNFINISHED_RES' && (
                        <>{issue.reservation.name}</>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
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
      focusOnConfirm: true,
    });
  }, []);

  return runConflictsModal;
}
