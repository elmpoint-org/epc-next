'use client';

import { prettyError } from '@/util/prettyErrors';
import { notifications } from '@mantine/notifications';
import FileHandlerRoot, {
  type FileHandlePluginOptions,
} from '@tiptap-pro/extension-file-handler';

type FileHandlerEditor = FileHandlePluginOptions['editor'];

const MIME_TYPES = ['image/png', 'image/jpeg'];
const MAX_SIZE_MB = 0.5;

export const FileHandler = FileHandlerRoot.configure({
  onDrop(editor, files, pos) {
    handleFiles(editor, files, pos);
  },
  onPaste(editor, files, htmlContent) {
    if (htmlContent) {
      // TODO should this be handled separately
      // return false;
    }

    handleFiles(editor, files);
  },
});

function handleFiles(editor: FileHandlerEditor, files: File[], pos?: number) {
  // position is cursor unless defined
  if (typeof pos === 'undefined') pos = editor.state.selection.anchor;

  files.forEach(async (file) => {
    if (!MIME_TYPES.includes(file.type)) return err('FILE_TYPE');
    if (file.size > megabytes(MAX_SIZE_MB)) return err('TOO_LARGE');

    const data = await getDataURL(file);

    // define command chain
    let cmd = editor.chain();

    cmd = cmd.setImageBlockAt({
      src: data,
      pos,
    });
    cmd = cmd.focus();

    cmd.run();
  });
}

async function getDataURL(file: File) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
  });
}

// UTILITIES

function err(error: unknown) {
  notifications.show({
    color: 'red',
    title: 'Error',
    message: prettyError(
      {
        __DEFAULT: 'Unknown error.',
        FILE_TYPE: 'That file format isn’t supported.',
        TOO_LARGE: 'That file is too large.',
      },
      (s) => `Error code: ${s}`,
    )(error),
  });
}

const MB_CONST = 2 ** 20;
function megabytes(mb: number) {
  return mb * MB_CONST;
}
