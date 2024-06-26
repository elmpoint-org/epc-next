'use client';

import { Link, RichTextEditor } from '@mantine/tiptap';

import { useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';

import { clx } from '@/util/classConcat';
import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { EditFormProps } from './PageEditForm';
import { useEffect, useMemo } from 'react';
import { STATIC_EXTENSIONS } from '../EXTENSIONS';

// COMPONENT
export default function TextEditor({
  updateForm,
  serverContent,
}: { serverContent: string | null } & EditFormProps) {
  const parsedContent = useMemo(() => {
    try {
      if (!serverContent) return null;
      return JSON.parse(serverContent);
    } catch (_) {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverContent]);

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
            content: clx(
              'flex min-h-48 flex-col [&>*]:flex-1',
              /* prose */ 'prose prose-slate max-w-none first:prose-headings:mt-0 first:prose-p:mt-0',
              /* []() */ 'prose-a:font-bold prose-a:text-emerald-700 hover:prose-a:bg-dgreen/5',
              /* >  */ '*:prose-blockquote:not-italic before:*:prose-blockquote:content-none after:*:prose-blockquote:content-none',
              /* ` ` */ 'prose-code:-m-0 prose-code:rounded-md prose-code:bg-slate-200 prose-code:p-0 before:prose-code:content-none after:prose-code:content-none',
              /* ``` */ 'prose-pre:!bg-slate-200',
            ),
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

      {/* <div className="t">{editor?.getHTML()}</div>
      <div className="t">{JSON.stringify(editor?.getJSON())}</div> */}
    </>
  );
}
