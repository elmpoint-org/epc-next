'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getGQLError, graphql } from '@/query/graphql';
import { queryClient, useGraphQuery } from '@/query/query';
import { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import { SelectedFns, useSelectedFiles } from '../_ctx/selectedFiles';
import FilesPathBar from './FilesPathBar';
import FilesList from './FilesList';
import { TadaDocumentNode } from 'gql.tada';

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

  // db query
  const QUERY = [
    GET_CMS_FILES,
    { root: folderParsed, recursive: false },
  ] satisfies [TadaDocumentNode, VariablesOf<typeof GET_CMS_FILES>];
  const query = useGraphQuery(...QUERY, {
    retry(_, error) {
      const a = getGQLError(error);
      if (a?.length) return false;
      return true;
    },
  });
  const files = query.data?.cmsFiles?.files;

  function revalidate() {
    queryClient.invalidateQueries({
      queryKey: QUERY,
    });
  }

  // selected files
  const selectFns = useSelectedFiles(files);

  const fileManagerProps: FileManagerProps = {
    folder,
    setFolder,
    files,
    folderParsed,
    select: selectFns,
    revalidate,
  };

  return (
    <>
      <SkeletonProvider ready={!query.isPlaceholderData}>
        <div className="space-y-4 sm:p-4">
          {/* breadcrumbs bar */}
          <FilesPathBar {...fileManagerProps} />

          {/* main files list */}
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
  revalidate: () => void;
};
