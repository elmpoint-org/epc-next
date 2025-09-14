'use client';

import { queryClient, useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import PagesList from './PagesList';
import NewPageButton from './NewPageButton';

const GET_PAGES_QUERY = graphql(`
  query CmsPages {
    cmsPages {
      id
      slug
      title
      secure
      publish
      contributors {
        id
      }
      timestamp {
        created
        updated
      }
    }
  }
`);
export type PagesType = ResultOf<typeof GET_PAGES_QUERY>['cmsPages'];
export const GET_PAGES_QUERY_KEY = [GET_PAGES_QUERY, {}] as const;
export const revalidatePagesList = () =>
  queryClient.invalidateQueries({ queryKey: [GET_PAGES_QUERY, {}] });

// COMPONENT
export default function PagesContainer() {
  const pagesQuery = useGraphQuery(...GET_PAGES_QUERY_KEY);
  const pages = pagesQuery.data?.cmsPages ?? null;

  return (
    <>
      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col gap-6 p-6">
        <SkeletonProvider ready={!pagesQuery.isPending}>
          <div className="relative">
            <div className="flex flex-row items-center justify-between">
              <h3 className="py-4 text-lg">Pages</h3>
              <NewPageButton />
            </div>
            <PagesList pages={pages} />
          </div>

          <div className="t">
            <div className="flex flex-row items-center justify-between">
              <h3 className="py-4 text-lg">Unused (empty) pages</h3>
            </div>
            <PagesList pages={pages} unused />
          </div>
        </SkeletonProvider>
      </div>
    </>
  );
}
