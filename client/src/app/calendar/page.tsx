import CalendarWrapper from './_components/CalendarWrapper';

export default function CalendarPage() {
  return (
    <>
      <div className="container flex flex-1 flex-col gap-4 rounded-lg bg-slate-100 p-6">
        <CalendarWrapper />

        <div className="m-4 h-[1000px] rounded-lg bg-slate-200"></div>
      </div>
    </>
  );
}
