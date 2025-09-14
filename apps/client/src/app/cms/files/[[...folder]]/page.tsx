import { Metadata } from 'next';
import FileManager from './_components/FileManager';
import { PageArrayOptParams } from '@/util/propTypes';

export const metadata: Metadata = {
  title: 'Files',
};

export default async function FilesPage(props: PageArrayOptParams) {
  const params = await props.params;

  const { folder: folder_in } = params;

  const folder =
    '/' + (folder_in?.map((f) => decodeURIComponent(f)).join('/') ?? '');

  return (
    <>
      <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
        File Manager
      </h1>
      <div className="container flex-1 rounded-lg bg-dwhite">
        <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-4 p-3 sm:p-6">
          <FileManager folder={folder} />

          <hr />
          {/* folder notes */}
          <div className="m-4 flex flex-col gap-2">
            {/* backups disclosure */}
            <details
              open
              className="rounded-lg border border-sky-600 bg-sky-400/20 p-4 text-sm text-sky-900"
            >
              <summary className="font-bold">Made a mistake?</summary>
              <p className="pt-2">
                If you accidentally delete or overwrite a crucial file, email{' '}
                <b>backups@elmpoint.xyz</b> as soon as possible. We keep backups
                and can usually manually restore lost files or data as long as
                you contact us within 14 days.
              </p>
            </details>
            {/* folders disclosure */}
            <details className="rounded-lg border border-amber-600 bg-amber-400/20 p-4 text-sm text-amber-900">
              <summary className="font-bold">Using Folders</summary>
              <p className="pt-2">
                Amazon doesn’t track folders directly in their file system.
                Folder operations will be improved later, but for now the
                easiest way to move or rename a folder is to select all files
                within it and <b>move</b> them to the new desired folder name.
              </p>
            </details>
          </div>
        </div>
      </div>
    </>
  );
}
