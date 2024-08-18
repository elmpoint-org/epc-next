'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getGQLError, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { ResultOf } from '@graphql-typed-document-node/core';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import { SelectedFns, useSelectedFiles } from '../_ctx/selectedFiles';
import FilesPathBar from './FilesPathBar';
import FilesList from './FilesList';

const GET_CMS_FILES = graphql(`
  query Files($root: String, $recursive: Boolean) {
    cmsFiles(root: $root, recursive: $recursive) {
      files {
        path
        lastModified
        size
      }
      isComplete
    }
  }
`);
type FilesType = (ResultOf<typeof GET_CMS_FILES>['cmsFiles'] & {})['files'];

const DEBOUNCE_MS = 200;
const INVALID_PATH = '////';

export default function FileManager({ folder }: { folder: string }) {
  const router = useRouter();

  // parse folder name (debounced)
  const [folderParsed, setFolderParsed] = useState(INVALID_PATH);
  const isUnfetched = folderParsed === INVALID_PATH;
  useEffect(() => {
    const tm = setTimeout(() => {
      let f = folder.trim();
      f = f.length && f.at(-1) !== '/' ? f + '/' : f;
      if (f.at(0) === '/') f = f.slice(1);
      setFolderParsed(f);
    }, DEBOUNCE_MS);
    return () => clearTimeout(tm);
  }, [folder]);
  // set new folder value
  function setFolder(p: string) {
    router.push('/cms/files/' + p);
  }

  const query = useGraphQuery(
    GET_CMS_FILES,
    {
      root: folderParsed,
      recursive: false,
    },
    {
      retry(_, error) {
        const a = getGQLError(error);
        if (a?.length) return false;
        return true;
      },
    },
  );
  const files = query.data?.cmsFiles?.files;

  // selected files
  const selectFns = useSelectedFiles(files);

  const fileManagerProps: FileManagerProps = {
    folder,
    setFolder,
    files,
    folderParsed,
    select: selectFns,
  };

  return (
    <>
      <SkeletonProvider ready={!query.isPending}>
        <div className="space-y-4 p-4">
          {/* control bar */}
          <FilesPathBar {...fileManagerProps} />

          {/* files list  */}
          <FilesList
            {...fileManagerProps}
            newLoad={query.isFetching || isUnfetched}
          />
        </div>
      </SkeletonProvider>
    </>
  );
}

export type FileManagerProps = {
  folder: string;
  folderParsed: string;
  setFolder: (s: string) => void;
  files: FilesType | undefined;
  select: SelectedFns;
};
