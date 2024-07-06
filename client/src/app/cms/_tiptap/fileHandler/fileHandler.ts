'use client';

import { prettyError } from '@/util/prettyErrors';
import { ALLOWED_TYPES } from '@@/s3/IMAGE_OPTIONS';
import { notifications } from '@mantine/notifications';
import FileHandlerRoot, {
  type FileHandlePluginOptions,
} from '@tiptap-pro/extension-file-handler';
import { uploadImage } from './imageOperations';
import { getPageData } from '../pageData/pageData';

type FileHandlerEditor = FileHandlePluginOptions['editor'];

const MIME_TYPES = ALLOWED_TYPES;
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
    if (!MIME_TYPES.some((t) => t === file.type)) return err('FILE_TYPE');
    if (file.size > megabytes(MAX_SIZE_MB)) return err('TOO_LARGE');

    const { id: pageId } = getPageData(editor);

    // upload image and determine image width
    const [{ url, error }, width] = await Promise.all([
      uploadImage(file, pageId)
        .then((r) => ({ url: r, error: null }))
        .catch((c) => {
          let o = '';
          if (typeof c === 'string') o = c;
          else o = 'UPLOAD_ERROR';
          return { error: o, url: null };
        }),
      getImageWidth(file),
    ]);
    if (error || !url) return err(error);

    // create an image block
    let cmd = editor.chain();
    cmd = cmd.setImageBlockAt(pos, { src: url, imgWidth: width });
    cmd = cmd.focus();
    cmd.run();
  });
}

async function getImageWidth(file: File) {
  return new Promise<number>((resolve) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = 0 + img.width;
      URL.revokeObjectURL(src);
      resolve(w);
    };
    img.src = src;
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
