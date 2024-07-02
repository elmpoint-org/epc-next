import { cache } from 'react';
import { notFound } from 'next/navigation';

import { IconPencil } from '@tabler/icons-react';

import { graphError, graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { PageParams } from '@/util/propTypes';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { getUser } from '@/app/_ctx/user/provider';
import { scopeCheck } from '@/util/scopeCheck';

import A from '@/app/_components/_base/A';
import LoginBoundaryRedirect from '@/app/_components/_base/LoginBoundary/LoginBoundaryRedirect';
import PageRender from './_components/PageRender';
import PageStats from './_components/PageStats';

const GET_PAGE_FROM_SLUG = graphql(`
  query CmsPageFromSlug($slug: String!) {
    cmsPageFromSlug(slug: $slug) {
      id
      slug
      title
      content
      secure
      publish
      contributors {
        id
        name
      }
      timestamp {
        created
        updated
      }
    }
  }
`);
export type PagePropType = ResultOf<
  typeof GET_PAGE_FROM_SLUG
>['cmsPageFromSlug'] & {};

const getPage = cache(async (slug: string) => {
  const o: { data: PagePropType | null; error: string | null } = {
    data: null,
    error: null,
  };
  try {
    const d = await graphAuthServer(GET_PAGE_FROM_SLUG, { slug });
    o.data = d.cmsPageFromSlug;
  } catch (err: any) {
    o.error = graphError(err?.response?.errors);
  }
  return o;
});

// COMPONENT
export default async function CmsPage({ params: { slug } }: PageParams) {
  // attempt to find page
  const { data: page, error } = await getPage(slug);
  if (error === 'NEED_PERMISSION') return <LoginBoundaryRedirect />;
  if (!page) notFound();

  // check scope for edit link
  const user = (await getUser()) || null;
  const canEdit = scopeCheck(user?.scope ?? null, 'ADMIN', 'EDIT');

  return (
    <>
      {/* page */}
      <div className="flex flex-1 flex-col space-y-2">
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl">{page.title}</h1>
          <PageStats page={page} />
        </div>

        <PageRender page={page} />
      </div>

      {/* edit link */}
      {canEdit && (
        <div className="absolute right-0 top-0 p-2">
          <A href={`/cms/page/edit/${page.id}`}>
            <IconPencil className="mb-1 inline size-5" /> Edit this page
          </A>
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ params: { slug } }: PageParams) {
  const { data } = await getPage(slug);
  const t = data?.title;
  if (t?.length) return { title: t };
}
