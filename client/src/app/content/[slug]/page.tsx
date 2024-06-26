import { cache } from 'react';
import { notFound } from 'next/navigation';

import { graphError, graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { PageParams } from '@/util/propTypes';
import { ResultOf } from '@graphql-typed-document-node/core';

import PageRender from './_components/PageRender';
import LoginBoundaryRedirect from '@/app/_components/_base/LoginBoundary/LoginBoundaryRedirect';

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

export default async function CmsPage({ params: { slug } }: PageParams) {
  const { data: page, error } = await getPage(slug);

  if (error === 'NEED_PERMISSION') return <LoginBoundaryRedirect />;

  if (!page) notFound();

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        <h1 className="mb-6 flex flex-col items-center justify-center text-center text-4xl">
          {page.title}
        </h1>

        <PageRender page={page} />
      </div>
    </>
  );
}

export async function generateMetadata({ params: { slug } }: PageParams) {
  const { data } = await getPage(slug);
  const t = data?.title;
  if (t?.length) return { title: t };
}
