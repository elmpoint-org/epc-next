import { Editor, Extension } from '@tiptap/core';

export type PageDataStorage = {
  id: string;
};

declare module '@tiptap/core' {
  interface Storage {
    pageData: PageDataStorage;
  }
}

export const RegisterPageData = (pageId: string) =>
  Extension.create<{}, PageDataStorage>({
    name: 'pageData',
    addStorage() {
      return { id: pageId };
    },
  });

export function getPageData(editor: Editor) {
  const pd = editor.storage.pageData;
  return pd;
}
