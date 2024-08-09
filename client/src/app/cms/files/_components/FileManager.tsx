'use client';

import { useEffect, useState } from 'react';

import { getGQLError, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { ResultOf } from '@graphql-typed-document-node/core';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import FilesActionBar from './FilesActionBar';
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

export default function FileManager() {
  const [folder, setFolder] = useState('');

  // parse folder name (debounced)
  const [folderParsed, setFolderParsed] = useState('');
  useEffect(() => {
    const tm = setTimeout(() => {
      let f = folder.trim();
      f = f.length && f.at(-1) !== '/' ? f + '/' : f;
      if (f.at(0) === '/') f = f.slice(1);
      setFolderParsed(f);
    }, DEBOUNCE_MS);
    return () => clearTimeout(tm);
  }, [folder]);

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

  const fileManagerProps: FileManagerProps = {
    folder,
    setFolder,
    files,
    folderParsed,
  };

  return (
    <>
      <SkeletonProvider ready={!query.isPending}>
        <div className="space-y-4 p-4">
          {/* <h3 className="text-center text-sm font-bold uppercase">files</h3> */}

          {/* control bar */}
          <FilesActionBar {...fileManagerProps} />

          {/* files list  */}
          <FilesList {...fileManagerProps} newLoad={query.isFetching} />
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
};
