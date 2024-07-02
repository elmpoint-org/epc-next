'use client';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import type { ResultOf } from '@graphql-typed-document-node/core';
import PagesList from './PagesList';
import { SkeletonProvider } from '@/app/_ctx/skeleton/context';

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

// COMPONENT
export default function PagesQuery() {
  const pagesQuery = useGraphQuery(GET_PAGES_QUERY);
  const pages = pagesQuery.data?.cmsPages ?? null;
  return (
    <>
      <div className="mx-auto flex max-w-screen-xl flex-col gap-6 p-6">
        <SkeletonProvider ready={!pagesQuery.isPending}>
          <div className="t">
            <h3 className="py-4 text-lg">Pages</h3>
            <PagesList pages={pages} />
          </div>

          <div className="t">
            <h3 className="py-4 text-lg">Unused (empty) pages</h3>
            <PagesList pages={pages} unused />
          </div>
        </SkeletonProvider>
      </div>
    </>
  );
}
