import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { PageArrayParams } from '@/util/propTypes';
import { err } from '@/util/routeErr';
import { redirect } from 'next/navigation';

export async function GET(
  _: unknown,
  { params: { path: path_in } }: PageArrayParams,
) {
  const path = path_in.join('/');

  const { data, errors } = await graphAuthServer(
    graphql(`
      query Query($path: String!) {
        cmsFilePresign(path: $path)
      }
    `),
    { path },
  );
  if (errors || !data?.cmsFilePresign) {
    if (!errors) return err(404, 'NOT_FOUND');
    return err(400, errors[0]?.code ?? 'BAD_REQUEST');
  }

  redirect(data.cmsFilePresign);
}
