import {
  ModalFrame,
  ModalFrameFooter,
} from '@/app/_components/_base/ModalFrame';
import { clx } from '@/util/classConcat';
import { Button } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useFormCtx } from '../state/formCtx';
import { CUSTOM_ROOM_ID } from '@epc/types/cabins';

export default function ConflictsModal() {
  const { guests } = useFormCtx();

  const [isOpen, setIsOpen] = useState(false);

  const aa = useMemo(() => {
    for (const {
      room: { room },
    } of guests) {
      if (!room || room.id === CUSTOM_ROOM_ID) continue;

      // if(room.availableBeds < room.)
    }
  }, [guests]);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>click me</button>

      <ModalFrame
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={
          <>
            <IconAlertTriangle
              className="mx-2 -mt-1 inline size-5 text-amber-600"
              stroke={2}
            />{' '}
            Review possible issues
          </>
        }
        className={clx('[&_.panel]:max-w-3xl')}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4">
            <div className="prose prose-sm prose-slate my-2 max-w-none !leading-tight">
              <p>
                We noticed some potential conflicts with other reservations.
              </p>
              <p>
                You can go back and edit, or if everything looks good to you,
                click “Confirm and save” below.
              </p>
            </div>

            <div className="t"></div>

            <ModalFrameFooter>
              <div className="flex flex-row justify-end gap-2">
                <Button
                  color="slate"
                  variant="light"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}
                >
                  Go back
                </Button>
                <Button type="submit" data-autofocus>
                  Confirm and save
                </Button>
              </div>
            </ModalFrameFooter>
          </div>
        </form>
      </ModalFrame>
    </>
  );
}
