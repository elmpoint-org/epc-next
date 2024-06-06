import type { Children } from '@/util/childrenType';
import { clx } from '@/util/classConcat';

const LineLabel = ({
  className,
  children,
}: { className?: string } & Children) => {
  return (
    <>
      <div
        className={clx(
          'relative flex flex-row items-center gap-2 border-slate-500 text-center text-xs uppercase',
          className,
        )}
      >
        <div className="flex-1 border-t"></div>
        <div className="bg-dwhite">or</div>
        <div className="flex-1 border-t"></div>
      </div>
    </>
  );
};
export default LineLabel;
