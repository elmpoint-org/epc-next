import CalendarWrapper from './_components/CalendarWrapper';
import { SampleMonth, SampleWeek } from './_components/SampleCal';

export default function CalendarPage() {
  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <CalendarWrapper />

          {/* <div className="m-4 h-[1000px] rounded-lg bg-slate-200" />
          <SampleMonth />
          <hr />
          <SampleWeek /> */}
        </div>
      </div>
    </>
  );
}
