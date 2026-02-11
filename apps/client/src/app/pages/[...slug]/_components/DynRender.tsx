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
import {
  PhotoGallery,
  PhotoGalleryTypeName,
} from '@/app/cms/_tiptap/photoGallery/photoGalleryExt';
import PhotoGalleryNodeComponent from '@/app/cms/_tiptap/photoGallery/PhotoGalleryNode';

export default function DynRender({ content }: { content: string | null }) {
  const rn = useMemo(
    () =>
      renderToReactElement({
        extensions: [...STATIC_EXTENSIONS, Link, TestNodeDynamic, PhotoGallery],
        content: JSON.parse(content ?? ''),
        options: {
          markMapping: {
            link: LinkWrap as any,
          },
          nodeMapping: {
            [TestNodeTypeName]: TestNodeStable,
            [PhotoGalleryTypeName]: PhotoGalleryNodeComponent,
          } as any,
        },
      }),
    [content],
  );

  return (
    <div className="">
      <div className="">{rn}</div>
    </div>
  );
}
