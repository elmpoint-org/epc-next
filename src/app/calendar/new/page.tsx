import { Metadata } from 'next';
import NewEventForm from './_components/Form';

export const metadata: Metadata = {
  title: 'add your stay',
};

const CalendarNewPage = () => {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <div className="m-6 flex flex-col items-center justify-center text-4xl">
          Calendar
        </div>

        <div className="flex-1 rounded-lg ">
          <NewEventForm />
        </div>
      </div>
    </>
  );
};
export default CalendarNewPage;
