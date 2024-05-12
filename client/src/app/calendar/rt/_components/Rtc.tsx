'use client';

import RoomSelector from '../../new/_components/RoomSelector';

const Rtc = () => {
  return (
    <>
      <div className="m-6 mx-auto flex max-w-3xl flex-col space-y-8 rounded-md p-4 md:p-6">
        <div className="mx-auto w-80">
          <RoomSelector />
        </div>
      </div>
    </>
  );
};
export default Rtc;
