'use client';

import { STATIC_EXTENSIONS } from '@/app/cms/_tiptap/staticExtensions';
import TestNodeComponent from '@/app/cms/_tiptap/TestNode';
import { TestNode, TestNodeTypeName } from '@/app/cms/_tiptap/testNodeExt';
import { TestNodeDynamic } from '@/app/cms/_tiptap/testNodeExtDynamic';
import TestNodeStable from '@/app/cms/_tiptap/TestNodeStable';
import Link from '@tiptap/extension-link';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import NextLink from 'next/link';

import LinkWrap from './LinkWrap';
import A from '@/app/_components/_base/A';
import { ReactNode, useMemo } from 'react';

export default function DynRender({ content }: { content: string | null }) {
  const rn = useMemo(
    () =>
      renderToReactElement({
        extensions: [...STATIC_EXTENSIONS, Link, TestNode],
        content: JSON.parse(content ?? ''),
        options: {
          markMapping: {
            link: LinkWrap as any,
          },
          nodeMapping: {
            [TestNodeTypeName]: TestNodeStable as any,
          },
        },
      }),
    [content],
  );

  return (
    <div className="">
      <div className="">dynrender</div>
      <div className="">{rn}</div>
    </div>
  );
}
