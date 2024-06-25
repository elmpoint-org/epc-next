import NewPageForm from './_components/NewPageForm';

export default function NewPagePage() {
  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <h2 className="p-6 text-center text-2xl">Create a new page</h2>

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <NewPageForm />
        </div>
      </div>
    </>
  );
}
