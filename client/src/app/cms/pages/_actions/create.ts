'use server';

import { getUser } from '@/app/_ctx/user/provider';
import { graphError, graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { ResultOf } from '@graphql-typed-document-node/core';

const NEW_CMS_PAGE = graphql(`
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
`);
type CmsPageOut = ResultOf<typeof NEW_CMS_PAGE>['cmsPageCreate'];

export async function createNewPage() {
  const output: { data: CmsPageOut | null; error: string | null } = {
    data: null,
    error: null,
  };
  try {
    const user = (await getUser()) || null;

    const data = await graphAuthServer(NEW_CMS_PAGE, {
      title: '',
      secure: true,
      publish: false,
      contributorAdd: user?.id,
    }).catch((err) => {
      throw graphError(err?.response?.errors);
    });
    if (!data?.cmsPageCreate) throw 'SERVER_ERROR';

    output.data = data.cmsPageCreate;
  } catch (error) {
    output.error = (error as string) || null;
  } finally {
    return output;
  }
}
