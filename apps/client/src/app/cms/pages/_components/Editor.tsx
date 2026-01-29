import { useEffect, useMemo } from 'react';

import { Link, RichTextEditor } from '@mantine/tiptap';
import { AnyExtension, useEditor } from '@tiptap/react';

import { STATIC_EXTENSIONS } from '../../_tiptap/staticExtensions';
import { FileHandler } from '../../_tiptap/fileHandler/fileHandler';
import { RegisterPageData } from '../../_tiptap/pageData/pageData';
import { Placeholder } from '@tiptap/extensions';

import { clx } from '@/util/classConcat';
import { isDev } from '@/util/dev';
import { proseStyles } from '../../_tiptap/proseStyles';
import { useDebounceWithStatus } from '@/util/debounce';
import type { EditFormProps } from '../edit/[id]/_components/PageEditForm';

import ImageMenu from '../../_tiptap/image/ImageMenu';
import { IconStar } from '@tabler/icons-react';
import { TestNodeDynamic } from '../../_tiptap/testNodeExtDynamic';

const UPDATE_DEBOUNCE_MS = 450;

// COMPONENT
export default function TextEditor({
  pageId,
  form,
  updateForm,
  serverPage,
  onTyping,
}: { onTyping?: (isTyping: boolean) => void } & EditFormProps) {
  // parse content from server
  const parsedContent = useMemo(() => {
    try {
      if (!serverPage?.content) return null;
      return JSON.parse(serverPage.content);
    } catch (_) {
      return null;
    }
  }, [serverPage]);

  // typing status
  const { debounce, isPending } = useDebounceWithStatus(
    (f: () => void) => f(),
    UPDATE_DEBOUNCE_MS,
  );
  useEffect(() => {
    onTyping?.(isPending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  // init editor
  const editor = useEditor({
    extensions: [
      ...STATIC_EXTENSIONS,
      TestNodeDynamic,
      Link as AnyExtension,
      FileHandler,
      Placeholder.configure({ placeholder: 'Start writing...' }),
      RegisterPageData(pageId),
    ],
    shouldRerenderOnTransaction: true,
    immediatelyRender: false,

    content: parsedContent ?? undefined,

    onUpdate({ editor }) {
      debounce(() => updateForm({ content: JSON.stringify(editor.getJSON()) }));
    },
  });

  useEffect(() => {
    if (parsedContent) editor?.commands.setContent(parsedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedContent]);

  return (
    <>
      <RichTextEditor
        editor={editor}
        withTypographyStyles={false}
        withCodeHighlightStyles={false}
        classNames={{
          // root: 'overflow-clip',
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
            <RichTextEditor.ColorPicker
              colors={[
                '#25262b',
                '#868e96',
                '#fa5252',
                '#e64980',
                '#be4bdb',
                '#7950f2',
                '#4c6ef5',
                '#228be6',
                '#15aabf',
                '#12b886',
                '#40c057',
                '#82c91e',
                '#fab005',
                '#fd7e14',
              ]}
            />
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

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              onClick={() =>
                editor?.commands.insertTestNode(editor.state.selection.anchor)
              }
              aria-label="custom node"
              title="custom node"
            >
              <IconStar stroke={1.5} size={16} />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        {/* context menus */}
        {editor && (
          <>
            <ImageMenu editor={editor} />
          </>
        )}

        {/* editor content */}
        <RichTextEditor.Content />
      </RichTextEditor>

      {/* dev mode: see editor JSON */}
      {isDev && (
        <details>
          <summary>JSON</summary>
          <pre className="overflow-hidden">
            {JSON.stringify(
              JSON.parse(form.content.length ? form.content : '{}'),
              null,
              2,
            )}
          </pre>
        </details>
      )}
    </>
  );
}
