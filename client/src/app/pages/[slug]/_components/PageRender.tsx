import { generateHTML } from '@tiptap/html';
import { STATIC_EXTENSIONS } from '@/app/cms/pages/EXTENSIONS';
import Link from '@tiptap/extension-link';

import { clx } from '@/util/classConcat';
import { proseStyles } from '@/app/cms/_util/proseStyles';
import type { PagePropType } from '../page';

export default function PageRender({ page }: { page: PagePropType }) {
  let c;
  try {
    c = JSON.parse(page.content!);
  } catch (_) {
    return null;
  }

  const body = generateHTML(c, [...STATIC_EXTENSIONS, Link]);

  return (
    <>
      <div className="container flex-1 rounded-lg bg-slate-100">
        <div className="mx-auto mt-4 flex max-w-screen-lg flex-col gap-4 p-6">
          <div className={clx(proseStyles)}>
            <div className="t" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </div>
      </div>
    </>
  );
}
