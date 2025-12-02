import { useMemo } from 'react';
import { useFormCtx } from '../new/state/formCtx';

/** map of room IDs to count of local occupants */
export function useLocalOccupants() {
  const { guests } = useFormCtx();

  const localOccupants = useMemo(() => {
    const map = new Map<string, number>();

    for (const res of guests) {
      if (!res.room.room || res.room.room.noCount) continue;
      const id = res.room.room.id;

      map.set(id, 1 + (map.get(id) ?? 0));
    }

    return map;
  }, [guests]);

  return localOccupants;
}
