import { CABIN_COLORS, getCabinColor } from '../_util/cabinColors';
import { clmx } from '@/util/classConcat';

export default function RoomSwatch({
  cabinOrRoomId: id,
  className,
}: {
  cabinOrRoomId?: string;
  className?: string;
}) {
  return (
    <>
      {getCabinColor(id) && (
        <div
          className={clmx(
            'size-2 rounded-full',
            CABIN_COLORS[getCabinColor(id)!]?.swatch,
            className,
          )}
        />
      )}
    </>
  );
}
