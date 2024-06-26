import { notFound } from 'next/navigation';

import { PageParams } from '@/util/propTypes';
import { graphAuthServer } from '@/query/graphql.server';
import { graphql } from '@/query/graphql';

import PageEditForm from '../../_components/PageEditForm';
import A from '@/app/_components/_base/A';

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

  const { slug } = data.cmsPage;

  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        {/* <h2 className="p-6 text-center text-2xl">Page editor</h2> */}

        <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
          <PageEditForm id={id} />
        </div>

        <div className="p-6">
          <A
            href={slug ? `/content/${data.cmsPage.slug}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
          >
            view page
          </A>
        </div>
      </div>
    </>
  );
}
