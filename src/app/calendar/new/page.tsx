import { Metadata } from 'next';
import NewEventForm from './_components/Form';

export const metadata: Metadata = {
  title: 'add your stay',
};

const CalendarNewPage = () => {
  return (
    <>
      <div className="flex-1 rounded-lg bg-slate-100">
        <h2 className="text-center p-6 text-xl">Add your stay</h2>
        <NewEventForm />
      </div>
    </>
  );
};
export default CalendarNewPage;
