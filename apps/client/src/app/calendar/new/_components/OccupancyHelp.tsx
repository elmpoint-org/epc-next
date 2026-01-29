import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useState } from 'react';

import RoomOption, { CustomRoomOption } from './RoomOption';

export default function OccupancyHelp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-2 cursor-help text-nowrap text-right text-xs italic text-slate-500"
      >
        What do these icons mean?
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogBackdrop
          transition
          className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-[8px] transition duration-200 data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 z-[200] flex flex-col items-center">
          <DialogPanel
            transition
            className="mx-4 my-8 flex flex-col items-center overflow-y-auto text-dwhite transition data-[closed]:opacity-0 lg:mt-16"
            onClick={() => setIsOpen(false)}
          >
            <div className="space-y-4 py-6">
              <h4 className="mb-4 text-center text-xl font-semibold">
                What do these icons mean?
              </h4>
            </div>

            {/* example options */}
            <div className="grid max-w-full grid-cols-[min-content_minmax(0,65ch)] items-center gap-x-8 gap-y-5">
              {/* ROOM OCCUPANCY */}
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Bedroom',
                    aliases: [],
                    availableBeds: 2,
                    beds: 2,
                    forCouples: false,
                    cabin: null,
                  }}
                />
              </div>
              <span className="t">
                <b>2 out of 2 beds are available.</b>
                <br />
                This room is empty for your entire stay!
              </span>
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Bedroom',
                    aliases: [],
                    availableBeds: 1,
                    beds: 2,
                    forCouples: false,
                    cabin: null,
                  }}
                />
              </div>
              <span className="t">
                <b>1 bed available.</b> <br />
                You’d be sharing this room with someone else.
              </span>
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Bedroom',
                    aliases: [],
                    availableBeds: 0,
                    beds: 2,
                    forCouples: false,
                    cabin: null,
                  }}
                />
              </div>
              <span className="">
                <b>No beds available.</b>
                <br />
                This room is fully booked for at least one day of your stay.
              </span>
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Bedroom',
                    aliases: [],
                    availableBeds: null,
                    beds: 2,
                    forCouples: false,
                    cabin: null,
                  }}
                />
              </div>
              <span className="">
                <b>No data.</b>
                <br />
                You need to select the dates of your stay to get availability
                info.
              </span>

              <div className="col-span-full h-4" />

              {/* BED SHARING */}
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Bedroom',
                    aliases: [],
                    availableBeds: null,
                    noCount: true,
                    beds: 0,
                    forCouples: true,
                    cabin: null,
                  }}
                />
              </div>
              <span className="t">
                <b>Double bed or larger.</b>
                <br />
                This room has a double, queen, or king bed which can comfortably
                fit two people.
              </span>

              <div className="col-span-full h-4" />

              {/*  CUSTOM */}
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <CustomRoomOption>My text</CustomRoomOption>
              </div>
              <span className="">
                <b>Your own custom text.</b>
                <br />
                You can always fill in custom text instead of a specific room.
                Just type your message and select this option.
              </span>

              <div className="col-span-full h-4" />

              {/*  NICKNAMES */}
              <div className="whitespace-nowrap rounded-md bg-dwhite px-4 py-2 text-dblack">
                <RoomOption
                  active={false}
                  item={{
                    id: '',
                    name: 'Corner Bedroom',
                    aliases: [],
                    noCount: true,
                    availableBeds: null,
                    beds: 0,
                    forCouples: false,
                    useAlias: 'Ann’s Room' as any,
                    cabin: null,
                  }}
                />
              </div>
              <span className="">
                <b>Using alternate name.</b>
                <br />
                Your search matches an alternate name for this room. Hover over
                the <code>ALT</code> symbol to see the original name.
              </span>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
