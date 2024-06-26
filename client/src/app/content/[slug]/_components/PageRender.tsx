import { PagePropType } from '../page';
import { clx } from '@/util/classConcat';

import { generateHTML } from '@tiptap/html';
import Link from '@tiptap/extension-link';
import { STATIC_EXTENSIONS } from '@/app/cms/page/EXTENSIONS';

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
          <div
          // TODO this cannot be duplicated
            className={clx(
              'flex min-h-48 flex-col [&>*]:flex-1',
              /* prose */ 'prose prose-slate max-w-none first:prose-headings:mt-0 first:prose-p:mt-0',
              /* []() */ 'prose-a:font-bold prose-a:text-emerald-700 hover:prose-a:bg-dgreen/5',
              /* >  */ '*:prose-blockquote:not-italic before:*:prose-blockquote:content-none after:*:prose-blockquote:content-none',
              /* ` ` */ 'prose-code:-m-0 prose-code:rounded-md prose-code:bg-slate-200 prose-code:p-0 before:prose-code:content-none after:prose-code:content-none',
              /* ``` */ 'prose-pre:!bg-slate-200',
            )}
          >
            <div className="t" dangerouslySetInnerHTML={{ __html: body }} />
          </div>
        </div>
      </div>
    </>
  );
}
