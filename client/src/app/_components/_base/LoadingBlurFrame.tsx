import { IconLoader2 } from '@tabler/icons-react';

const LoadingBlurFrame = () => {
  return (
    <>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-dblack/5 bg-slate-300/30 backdrop-blur-sm">
        <div className="animate-spin text-dgreen">
          <IconLoader2 className="size-8" />
        </div>
      </div>
    </>
  );
};
export default LoadingBlurFrame;
