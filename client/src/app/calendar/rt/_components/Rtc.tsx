'use client';

import Opts from './Opts';

const Rtc = () => {
  return (
    <>
      <div className="m-6 mx-auto flex max-w-3xl flex-col space-y-8 rounded-md p-4 md:p-6">
        <div className="mx-auto w-80">
          <Opts />
        </div>
      </div>
    </>
  );
};
export default Rtc;
