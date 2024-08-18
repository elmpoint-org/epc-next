import { Metadata } from 'next';
import FileManager from './_components/FileManager';
import { PageArrayOptParams } from '@/util/propTypes';

export const metadata: Metadata = {
  title: 'Files',
};

export default function FilesPage({
  params: { folder: folder_in },
}: PageArrayOptParams) {
  const folder = '/' + (folder_in?.join('/') ?? '');

  return (
    <>
      <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
        File Manager
      </h1>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <FileManager folder={folder} />
        </div>
      </div>
    </>
  );
}
