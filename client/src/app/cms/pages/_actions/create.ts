'use server';

import { getUser } from '@/app/_ctx/user/provider';
import { graphError } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { CmsPageCreateType, NEW_CMS_PAGE_KEY } from '../../_util/queries';

export async function createNewPage() {
  const output: { data: CmsPageCreateType | null; error: string | null } = {
    data: null,
    error: null,
  };
  try {
    const user = (await getUser()) || null;

    const data = await graphAuthServer(...NEW_CMS_PAGE_KEY(user?.id)).catch(
      (err) => {
        throw graphError(err?.response?.errors);
      },
    );
    if (!data?.cmsPageCreate) throw 'SERVER_ERROR';

    output.data = data.cmsPageCreate;
  } catch (error) {
    output.error = (error as string) || null;
  } finally {
    return output;
  }
}
