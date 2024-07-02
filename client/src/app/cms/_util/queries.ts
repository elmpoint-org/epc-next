import { graphql } from '@/query/graphql';
import type { ResultOf, VariablesOf } from '@graphql-typed-document-node/core';

export const NEW_CMS_PAGE = graphql(`
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
export type CmsPageCreateType = ResultOf<typeof NEW_CMS_PAGE>['cmsPageCreate'];
export const NEW_CMS_PAGE_KEY = (userId?: string) =>
  [
    NEW_CMS_PAGE,
    {
      title: '',
      secure: true,
      publish: false,
      contributorAdd: userId,
    } as VariablesOf<typeof NEW_CMS_PAGE>,
  ] as const;
