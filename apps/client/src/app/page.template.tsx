export default function Page() {
  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          Page Title
        </h1>
        <div className="container flex-1 rounded-lg bg-dwhite">
          <h2 className="p-6 text-center text-2xl">Subheading</h2>

          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
            <p className="">content</p>
          </div>
        </div>
      </div>
    </>
  );
}
