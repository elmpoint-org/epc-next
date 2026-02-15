'use client';

import { STATIC_EXTENSIONS } from '@/app/cms/_tiptap/staticExtensions';
import Link from '@tiptap/extension-link';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';

import LinkWrap from './LinkWrap';
import { useMemo } from 'react';
import { PhotoGalleryTypeName } from '@/app/cms/_tiptap/photoGallery/photoGalleryExt';
import PhotoGalleryNodeComponent from '@/app/cms/_tiptap/photoGallery/PhotoGalleryNode';

export default function DynRender({ content }: { content: string | null }) {
  const page = useMemo(() => {
    try {
      return renderToReactElement({
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
      });
    } catch (_) {
      return null;
    }
  }, [content]);

  return (
    <div className="">
      {/* page content */}
      {page || (
        // error state
        <div className="text-center text-sm italic text-red-800">
          An error occurred.
        </div>
      )}
    </div>
  );
}
