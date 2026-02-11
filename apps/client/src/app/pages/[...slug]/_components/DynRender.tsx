'use client';

import { STATIC_EXTENSIONS } from '@/app/cms/_tiptap/staticExtensions';
import Link from '@tiptap/extension-link';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

import LinkWrap from './LinkWrap';
import { useMemo } from 'react';
import { PhotoGalleryTypeName } from '@/app/cms/_tiptap/photoGallery/photoGalleryExt';
import PhotoGalleryNodeComponent from '@/app/cms/_tiptap/photoGallery/PhotoGalleryNode';

export default function DynRender({ content }: { content: string | null }) {
  const page = useMemo(
    () =>
      renderToReactElement({
        extensions: [...STATIC_EXTENSIONS, Link],
        content: JSON.parse(content ?? ''),
        options: {
          markMapping: {
            link: LinkWrap as any,
          },
          nodeMapping: {
            [PhotoGalleryTypeName]: PhotoGalleryNodeComponent,
          } as any,
        },
      }),
    [content],
  );

  return (
    <div className="">
      {/* page content */}
      {page}
    </div>
  );
}
