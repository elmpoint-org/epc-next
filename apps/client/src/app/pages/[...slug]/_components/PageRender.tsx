import { generateHTML } from '@tiptap/html';
import { STATIC_EXTENSIONS } from '@/app/cms/_tiptap/staticExtensions';
import Link from '@tiptap/extension-link';

import { clx } from '@/util/classConcat';
import { proseStyles } from '@/app/cms/_tiptap/proseStyles';
import type { PagePropType } from '../page';
import { TestNode } from '@/app/cms/_tiptap/testNodeExt';
import DynRender from './DynRender';

export default function PageRender({ page }: { page: PagePropType }) {
  return (
    <>
      <div className="container flex-1 rounded-lg bg-dwhite">
        <div className="mx-auto mt-4 flex max-w-screen-lg flex-col gap-4 p-6">
          <div className={clx(proseStyles)}>
            <DynRender content={page.content} />
          </div>
        </div>
      </div>
    </>
  );
}
