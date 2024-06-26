import { Children } from '@/util/propTypes';

export default function CalendarLayout({ children }: Children) {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Calendar
        </h1>

        {children}
      </div>
    </>
  );
}
