import { Combobox, Tooltip } from '@mantine/core';
import { IconAlt, IconCheck, IconFriends } from '@tabler/icons-react';

import type { Cabin, Room } from '../state/formCtx';

const RoomOption = ({
  item,
  active,
}: {
  item: Room | Cabin;
  active: boolean;
}) => {
  const aliasTag = item.useAlias && (
    <div className="">
      <Tooltip withArrow label={`Alternate name for "${item.name}"`}>
        <IconAlt
          size={20}
          stroke={1.75}
          className="text-sky-700 group-data-[combobox-selected]:text-inherit"
        />
      </Tooltip>
    </div>
  );

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
            data-open={item.availableBeds === item.beds ? true : null}
            data-full={item.availableBeds < 1 ? true : null}
          >
            <div className="flex flex-1 flex-row items-center gap-2">
              {/* room name */}
              <div className="t">{item.useAlias || item.name}</div>
              {aliasTag}
              {/* room occupancy */}
              <div
                className="text-nowrap text-slate-600 data-[hide]:hidden group-data-[combobox-selected]:text-dwhite"
                data-hide={item.noCount}
              >
                (
                <span className="font-bold text-yellow-700  group-data-[combobox-selected]:!text-inherit group-data-[full]/b:text-red-600 group-data-[open]/b:text-emerald-700">
                  {item.availableBeds}
                </span>
                /{item.beds})
              </div>
              {/* room tag icons */}
              <div className="t">
                {item.forCouples && (
                  <Tooltip
                    label="This room can accomodate a couple sharing a bed."
                    withArrow
                  >
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
