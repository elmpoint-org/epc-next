import { confirmModal } from '@/app/_components/_base/modals';
import { graphAuth, graphql } from '@/query/graphql';

export async function confirmAndDelete(folder: string, files: string[]) {
  const yes = await confirmModal({
    color: 'red',
    title: <>Are you sure?</>,
    body: (
      <>
        Are you sure you want to <b>permanently delete</b> the selected items?
      </>
    ),
  });
  if (!yes) return false;
  const y2 = confirm('Are you really sure?');
  if (!y2) return false;

  const { data, errors } = await graphAuth(
    graphql(`
      mutation CmsFileDelete($paths: [String!]!) {
        cmsFileDelete(paths: $paths)
      }
    `),
    { paths: files },
  );
  if (errors || !data?.cmsFileDelete) {
    console.log(errors?.[0].code ?? errors);
    return false;
  }

  return true;
}
