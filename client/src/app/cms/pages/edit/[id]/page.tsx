import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageParams } from '@/util/propTypes';
import { graphAuthServer } from '@/query/graphql.server';
import { graphql } from '@/query/graphql';

import PageEditForm from './_components/PageEditForm';

export const revalidate = 0;
export const metadata: Metadata = {
  title: 'Edit page',
};

export default async function EditPagePage({ params: { id } }: PageParams) {
  const data = await graphAuthServer(
    graphql(`
      query CmsPage($id: ID!) {
        cmsPage(id: $id) {
          id
          slug
        }
      }
    `),
    { id },
  ).catch(() => {});
  if (!data?.cmsPage) notFound();

  return (
    <>
      <h1 className="mb-6 flex flex-col items-center justify-center text-center text-4xl">
        Edit page
      </h1>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <PageEditForm id={id} />
        </div>
      </div>
    </>
  );
}
