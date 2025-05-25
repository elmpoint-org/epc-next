import { graphql } from '@/query/graphql';
import { graphAuthServer } from '@/query/graphql.server';
import { err } from '@/util/routeErr';
import { redirect } from 'next/navigation';

export async function GET(_: unknown, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const {
    id
  } = params;

  const { data, errors } = await graphAuthServer(
    graphql(`
      query CmsImage($id: ID!) {
        cmsImage(id: $id) {
          url
        }
      }
    `),
    { id },
  );
  if (errors || !data?.cmsImage) {
    if (!errors) return err(404, 'NOT_FOUND');
    return err(400, errors[0]?.code ?? 'BAD_REQUEST');
  }

  redirect(data.cmsImage.url);
}
