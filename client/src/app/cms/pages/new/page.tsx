import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { getUser } from '@/app/_ctx/user/provider';

export const metadata: Metadata = {
  title: 'Create new page',
};

export default async function NewPagePage() {
  const user = (await getUser()) || null;

  const data = await graphAuthServer(
    graphql(`
      mutation CmsPageCreate(
        $title: String!
        $secure: Boolean!
        $publish: Boolean!
        $contributorAdd: String
      ) {
        cmsPageCreate(
          title: $title
          secure: $secure
          publish: $publish
          contributorAdd: $contributorAdd
        ) {
          id
        }
      }
    `),
    {
      title: '',
      secure: true,
      publish: false,
      contributorAdd: user?.id,
    },
  ).catch((err) => {
    console.log(err?.response);
  });
  if (!data?.cmsPageCreate) return <>An error occurred.</>;

  const { id } = data.cmsPageCreate;

  redirect(`/cms/page/edit/${id}`);
}
