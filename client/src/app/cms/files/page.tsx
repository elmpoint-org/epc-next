import { Metadata } from 'next';
import FileManager from './_components/FileManager';

export const metadata: Metadata = {
  title: 'Files',
};

export default function FilesPage() {
  return (
    <>
      <FileManager />
    </>
  );
}
