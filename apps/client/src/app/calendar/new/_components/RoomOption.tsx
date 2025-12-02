import { useMemo } from 'react';

import { Combobox, Pill, Tooltip } from '@mantine/core';
import { IconAlt, IconCheck, IconFriends } from '@tabler/icons-react';

import { useFormCtx, type Cabin, type Room } from '../state/formCtx';
import { ANY_ROOM } from '@epc/types/cabins';
import { Children } from '@/util/propTypes';
import { useLocalOccupants } from '../../_util/localOccupants';

const RoomOption = ({
  item,
  active,
}: {
  item: Room | Cabin;
  active: boolean;
}) => {
  // calculate occupancy to include other selected rooms
  const localOccupants = useLocalOccupants();
  const available = useMemo(() => {
    let available: number | null = null;
    if ('beds' in item && item.availableBeds !== null) {
      available = item.availableBeds - (localOccupants.get(item.id) ?? 0);
    }
    return available;
  }, [item, localOccupants]);

  const aliasTag = <AliasTag isAlias={!!item.useAlias} name={item.name} />;

  return (
    <>
      <Combobox.Option value={item.id} className="group">
        {!('beds' in item) ? (
          // cabin entry
          <div className="flex flex-row items-center gap-2">
            <div className="">{item.useAlias || item.name} ...</div>
            {aliasTag}
          </div>
        ) : (
          // room entry
          <div
            className="group/b flex flex-row"
            data-open={available === item.beds ? true : null}
            data-full={available !== null && available < 1 ? true : null}
          >
            <div className="flex flex-1 flex-row items-center gap-2">
              {/* room name */}
              {item.name === ANY_ROOM && (
                <div className="italic">(any available room)</div>
              )}
              <div className="hidden first:block">
                {item.useAlias || item.name}
              </div>
              {aliasTag}
              {/* room occupancy */}
              <div
                className="text-nowrap text-slate-600 data-[hide]:hidden group-data-[combobox-selected]:text-dwhite"
                data-hide={item.noCount || null}
              >
                (
                <span className="font-bold text-yellow-700  group-data-[combobox-selected]:!text-inherit group-data-[full]/b:text-red-600 group-data-[open]/b:text-emerald-700">
                  {available ?? '?'}
                </span>
                /{item.beds})
              </div>
              {/* room tag icons */}
              <div className="t">
                {item.forCouples && (
                  <Tooltip label="This room has a shareable bed." withArrow>
                    <IconFriends
                      className="text-emerald-800 group-data-[combobox-selected]:text-inherit"
                      size={20}
                      stroke={1.75}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
            {active && (
              <>
                <IconCheck stroke={1} />
              </>
            )}
          </div>
        )}
      </Combobox.Option>
    </>
  );
};
export default RoomOption;

function AliasTag({ isAlias, name }: { isAlias?: boolean; name?: string }) {
  return (
    <>
      {isAlias && (
        <div className="">
          <Tooltip withArrow label={`Alternate name for “${name}”`}>
            <IconAlt
              size={20}
              stroke={1.75}
              className="text-sky-700 group-data-[combobox-selected]:text-inherit"
            />
          </Tooltip>
        </div>
      )}
    </>
  );
}

export function CustomRoomOption({ children }: Children) {
  return (
    <Combobox.Option value="CUSTOM" className="">
      <div className="flex flex-row items-center gap-2">
        <div className="truncate">{children}</div>
        <Pill
          size="xs"
          className="border border-sky-600 uppercase text-sky-600"
        >
          custom
        </Pill>
      </div>
    </Combobox.Option>
  );
}
