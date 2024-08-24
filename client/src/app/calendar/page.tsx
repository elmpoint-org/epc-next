import A from '@/app/_components/_base/A';

export default function CalendarPage() {
  return (
    <>
      <div className="container flex flex-1 flex-col gap-4 rounded-lg bg-slate-100 p-6">
        <h3 className="text-xl">calendar page</h3>
        <div className="t">
          <A href="/calendar/new">add your stay</A>
        </div>
      </div>
    </>
  );
}
