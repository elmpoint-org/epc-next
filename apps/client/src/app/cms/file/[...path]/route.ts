import { redirect } from 'next/navigation';
import qs from 'qs';

import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { PageArrayParams } from '@/util/propTypes';
import { err } from '@/util/routeErr';

export async function GET(req: Request, props: PageArrayParams) {
  const params = await props.params;

  const {
    path: path_in
  } = params;

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
    if (errors?.[0].code === 'NEED_PERMISSION') {
      const url = new URL(req.url);
      redirect(
        `/auth/login?${qs.stringify({ to: `${url.pathname}${url.search}${url.hash}` })}`,
      );
    }
    return err(400, errors[0]?.code ?? 'BAD_REQUEST');
  }

  redirect(data.cmsFilePresign);
}
