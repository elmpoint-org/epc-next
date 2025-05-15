export default function TUSkeleton({ i }: { i: number }) {
  return (
    <>
      <div
        className="flex flex-row gap-3 rounded-md border border-slate-200 px-4 py-2"
        style={{ opacity: 1 - 0.15 * i }}
      >
        <div className="size-5 animate-pulse rounded-full bg-slate-200" />
        <div className="my-1 w-36 animate-pulse rounded-full bg-slate-200" />
        <div className="flex-1 animate-pulse" />
        <div className="size-5 animate-pulse rounded-md bg-slate-200" />
      </div>
    </>
  );
}
