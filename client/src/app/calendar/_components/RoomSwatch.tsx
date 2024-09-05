import {
  CABIN_COLORS,
  getCabinColor,
  getCabinColorObject,
} from '../_util/cabinColors';
import { clmx } from '@/util/classConcat';

export default function RoomSwatch({
  cabinOrRoomId: id,
  withDefault,
  className,
}: {
  cabinOrRoomId?: string;
  withDefault?: boolean;
  className?: string;
}) {
  const css = getCabinColorObject(id, withDefault);

  return (
    <>
      {(withDefault || getCabinColor(id)) && (
        <div className={clmx('size-2 rounded-full', css?.swatch, className)} />
      )}
    </>
  );
}
