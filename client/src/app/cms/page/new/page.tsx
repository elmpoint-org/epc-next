import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';

export const metadata: Metadata = {
  title: 'Create new page',
};

export default async function NewPagePage() {
  const data = await graphAuthServer(
    graphql(`
      mutation CmsPageCreate(
        $title: String!
        $secure: Boolean!
        $publish: Boolean!
      ) {
        cmsPageCreate(title: $title, secure: $secure, publish: $publish) {
          id
        }
      }
    `),
    {
      title: '',
      secure: true,
      publish: false,
    },
  ).catch((err) => {
    console.log(err?.response);
  });
  if (!data?.cmsPageCreate) return <>An error occurred.</>;

  const { id } = data.cmsPageCreate;

  redirect(`/cms/page/edit/${id}`);
}
