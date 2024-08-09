import { Metadata } from 'next';
import FileManager from './_components/FileManager';

export const metadata: Metadata = {
  title: 'Files',
};

export default function FilesPage() {
  return (
    <>
      <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
        File Manager
      </h1>
      <div className="container flex-1 rounded-lg bg-slate-100">
        {/* <h2 className="p-6 text-center text-2xl">Subheading</h2> */}

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <FileManager />
        </div>
      </div>
    </>
  );
}
