import { generateHTML } from '@tiptap/html';
import { STATIC_EXTENSIONS } from '@/app/cms/_tiptap/staticExtensions';
import Link from '@tiptap/extension-link';

import { clx } from '@/util/classConcat';
import { proseStyles } from '@/app/cms/_tiptap/proseStyles';
import type { PagePropType } from '../page';

export default function PageRender({ page }: { page: PagePropType }) {
  let body;
  try {
    if (!page.content) return '';
    const c = JSON.parse(page.content);
    body = generateHTML(c, [...STATIC_EXTENSIONS, Link]);
  } catch (_) {
    return (
      <div className="text-center text-sm italic text-red-800">
        An error occurred.
      </div>
    );
  }

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
