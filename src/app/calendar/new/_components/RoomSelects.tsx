import { TextInput } from '@mantine/core';
import { Room } from './Room';

const RoomSelects = ({ numRooms }: { numRooms: number }) => {
  return (
    <>
      <div className="space-y-2">
        {Array(numRooms)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-stretch gap-7 rounded-xl border border-slate-300 p-4 pt-8 sm:flex-row sm:items-center sm:gap-3 sm:border-0 sm:px-0 sm:py-4"
            >
              <div className="flex flex-1 flex-row items-center gap-3">
                <div className="w-[2ch] text-right text-sm text-slate-500">
                  {i + 1}
                </div>
                <TextInput
                  label={`Name of ${!i ? 'Primary ' : ''}Guest(s)`}
                  className="-mt-6 flex-1"
                />
              </div>
              <TextInput label="Room" className="-mt-6 flex-1" />
              {/* <Room /> */}
            </div>
          ))}
      </div>
    </>
  );
};

export default RoomSelects;
