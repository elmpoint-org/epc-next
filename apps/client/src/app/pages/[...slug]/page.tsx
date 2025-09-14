import { cache } from 'react';
import { notFound } from 'next/navigation';

import { IconContract, IconPencil } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { PageArrayParams, PageParams } from '@/util/propTypes';
import type { ResultOf } from '@graphql-typed-document-node/core';
import { getUser } from '@/app/_ctx/user/provider';
import { scopeCheck } from '@/util/scopeCheck';

import A from '@/app/_components/_base/A';
import LoginBoundaryRedirect from '@/app/_components/_base/LoginBoundary/LoginBoundaryRedirect';
import PageRender from './_components/PageRender';
import PageStats from './_components/PageStats';
import PageError from '@/app/_components/_base/PageError';

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
  const { data, errors } = await graphAuthServer(GET_PAGE_FROM_SLUG, { slug });
  let error;
  if (!(error = errors?.[0].code)) error = errors;

  return { page: data?.cmsPageFromSlug ?? null, error };
});

// COMPONENT
export default async function CmsPage(props: PageArrayParams) {
  const params = await props.params;

  const { slug } = params;

  // attempt to find page
  const { page, error } = await getPage(slug.join('/'));
  if (error === 'NEED_PERMISSION') return <LoginBoundaryRedirect />;
  if (error === 'NOT_PUBLISHED')
    return (
      <PageError
        icon={IconContract}
        heading="Draft Page"
        text="This page is still a draft."
      />
    );
  if (!page) notFound();

  // check scope for edit link
  const user = (await getUser()) || null;
  const canEdit = scopeCheck(user?.scope ?? null, 'ADMIN', 'EDIT');

  return (
    <>
      {/* page */}
      <div className="flex flex-1 flex-col space-y-2">
        {/* title bar */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl">{page.title}</h1>
          <PageStats page={page} />
        </div>

        {/* page content */}
        <PageRender page={page} />
      </div>

      {/* edit link */}
      {canEdit && (
        <div
          className="absolute top-0 right-0 p-2 data-d:right-7 print:hidden"
          data-d={!page.publish || null}
        >
          <A href={`/cms/pages/edit/${page.id}`}>
            <IconPencil className="mb-1 inline size-5" /> Edit this page
          </A>
        </div>
      )}

      {/* draft banner */}
      {!page.publish && (
        <div className="fixed inset-y-0 right-0 flex rotate-180 flex-row justify-center bg-amber-600/80 p-1 text-sm text-dwhite uppercase [writing-mode:vertical-lr]">
          <div className="">Draft Page</div>
        </div>
      )}
    </>
  );
}

export async function generateMetadata(props: PageArrayParams) {
  const params = await props.params;

  const { slug } = params;

  const { page: data } = await getPage(slug.join('/'));
  const t = data?.title;
  if (t?.length) return { title: t };
  return {};
}
