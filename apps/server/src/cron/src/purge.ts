import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';

export async function purgeCooldown() {
  await graph(
    graphql(`
      mutation UserCooldownPurge {
        userCooldownPurge {
          id
        }
      }
    `)
  );
}

export async function purgeCMSImages() {
  // get data
  const { data: d1, errors: e1 } = await graph(
    graphql(`
      query CmsPages {
        cmsPages {
          content
        }
      }
    `)
  );
  if (e1 || !d1?.cmsPages) {
    console.error(e1);
    return;
  }
  const pages = d1.cmsPages;

  const { data: d2, errors: e2 } = await graph(
    graphql(`
      query CmsImages {
        cmsImages {
          id
        }
      }
    `)
  );
  if (e2 || !d2?.cmsImages) {
    console.error(e2);
    return;
  }

  // find unused images
  const imagesInDB = d2.cmsImages.filter((it) => !!it).map((it) => it.id);
  const content = d1.cmsPages.map((it) => it?.content ?? '').join('');
  const imageIdsInContent = Array.from(
    content.matchAll(/\/cms\/image\/([0-9a-f\-]+)/g),
    (m) => m[1]
  );
  const imagesToDelete = imagesInDB.filter(
    (id) => !imageIdsInContent.includes(id)
  );

  // delete images
  const { data } = await graph(
    graphql(`
      mutation CmsImageDeleteMultiple($ids: [ID!]!) {
        cmsImageDeleteMultiple(ids: $ids) {
          id
        }
      }
    `),
    { ids: imagesToDelete }
  );

  return data?.cmsImageDeleteMultiple;
}
