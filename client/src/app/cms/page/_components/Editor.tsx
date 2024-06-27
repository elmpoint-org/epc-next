'use client';

import { Link, RichTextEditor } from '@mantine/tiptap';

import { useEditor } from '@tiptap/react';
import { STATIC_EXTENSIONS } from '../EXTENSIONS';
import Placeholder from '@tiptap/extension-placeholder';

import { clx } from '@/util/classConcat';
import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { EditFormProps } from './PageEditForm';
import { useEffect, useMemo } from 'react';
import { proseStyles } from '../../_util/proseStyles';

// COMPONENT
export default function TextEditor({ updateForm, serverPage }: EditFormProps) {
  // init editor
  const editor = useEditor({
    extensions: [
      ...STATIC_EXTENSIONS,
      Link,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],

    onUpdate({ editor }) {
      updateForm({ content: JSON.stringify(editor.getJSON()) });
    },
  });

  // set content from server
  const parsedContent = useMemo(() => {
    try {
      if (!serverPage?.content) return null;
      return JSON.parse(serverPage.content);
    } catch (_) {
      return null;
    }
  }, [serverPage]);
  useEffect(() => {
    editor?.commands.setContent(parsedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedContent]);

  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="relative">
        <RichTextEditor
          editor={editor}
          withTypographyStyles={false}
          withCodeHighlightStyles={false}
          classNames={{
            root: 'overflow-clip',
            content: clx(proseStyles),
          }}
        >
          <RichTextEditor.Toolbar sticky>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Hr />
              <RichTextEditor.Blockquote />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignRight />
              <RichTextEditor.AlignJustify />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>

        {isSkeleton && (
          <div className="absolute inset-[-1px] z-50 bg-dwhite">
            <div className="absolute inset-0 animate-pulse rounded-lg bg-slate-200"></div>
          </div>
        )}
      </div>
    </>
  );
}
