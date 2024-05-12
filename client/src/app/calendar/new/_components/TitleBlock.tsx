import { ReactNode } from 'react';

const TitleBlock = (p: {
  number: ReactNode;
  title: ReactNode;
  children: ReactNode;
}) => {
  return (
    <>
      <div className="mb-12 mt-6 flex flex-col gap-3 px-0 first:mt-0 md:px-8">
        <div className="my-2 flex flex-row items-center justify-center gap-3 rounded-full bg-slate-200 py-4">
          <div className=" flex size-6 items-center justify-center rounded-full bg-dgreen text-sm font-bold text-dwhite">
            {p.number}
          </div>
          <h3 className="text-xl">{p.title}</h3>
        </div>

        <div className="prose px-4">{p.children}</div>
      </div>
    </>
  );
};
export default TitleBlock;
