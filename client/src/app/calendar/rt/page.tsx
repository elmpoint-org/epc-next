import Rtc from './_components/Rtc';

export default function RoomTestingPage() {
  return (
    <>
      <div className="flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-xl">rooms</h2>
        <Rtc />
      </div>
    </>
  );
}
