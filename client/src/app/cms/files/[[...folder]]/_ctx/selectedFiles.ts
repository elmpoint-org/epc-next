import { useMemo, useState } from 'react';

import { FileManagerProps } from '../_components/FileManager';

export type SelectedFns = {
  count: () => number;
  isSelected: (path: string) => boolean;
  toggle: (path: string) => void;
  selectFile: (path: string) => void;
  deselectFile: (path: string) => void;
  selectAll: () => void;
  selectNone: () => void;
};

export function useSelectedFiles(files: FileManagerProps['files']) {
  const [selected, setSelected] = useState<string[]>([]);
  const selectFns = useMemo<SelectedFns>(
    () => ({
      isSelected(path) {
        return selected.indexOf(path) >= 0;
      },
      count() {
        return selected.length;
      },
      toggle(path) {
        if (!this.isSelected(path)) this.selectFile(path);
        else this.deselectFile(path);
      },
      selectFile(path) {
        if (this.isSelected(path)) return;
        setSelected([...selected, path]);
      },
      deselectFile(path) {
        const i = selected.indexOf(path);
        if (i < 0) return;
        const ns = [...selected];
        ns.splice(i, 1);
        setSelected(ns);
      },
      selectAll() {
        setSelected(files?.map(({ path }) => path) ?? []);
      },
      selectNone() {
        setSelected([]);
      },
    }),
    [files, selected],
  );

  return selectFns;
}
