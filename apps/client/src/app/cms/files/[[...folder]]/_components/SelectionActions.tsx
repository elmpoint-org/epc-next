import { useEffect, useState } from 'react';

import { ActionIcon, Checkbox, Tooltip } from '@mantine/core';
import {
  IconFileImport,
  IconFolderPlus,
  IconPencilMinus,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';

import { FileManagerProps } from './FileManager';
import { ModalTypes } from './actions/actions';
import UploadModal from './actions/UploadModal';
import { confirmAndDelete } from './actions/deleteModal';
import RenameModal from './actions/RenameModal';
import NewFolderModal from './actions/NewFolderModal';
import MoveCopyModal from './actions/MoveCopyModal';
import { FileModalProps } from '@/app/_components/_base/ModalFrame';

export default function SelectionActions({
  select,
  revalidate,
  totalFiles,
  folderParsed,
  files,
}: {
  totalFiles?: number;
} & FileManagerProps) {
  const hasChecked = !!select.count();
  const isPartial = select.count() !== totalFiles;
  const isOne = select.count() === 1;
  const hasFolder = select.hasFolder();

  const [modal, setModal] = useState<ModalTypes>(null);
  useEffect(() => {
    if (modal === 'RESET_MODALS') {
      revalidate();
      select.selectNone();
      setModal(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  // modal props
  const modalProps = {
    onHide: (s) => setModal(s ? 'RESET_MODALS' : null),
    currentFolder: folderParsed,
  } satisfies Partial<FileModalProps>;

  return (
    <>
      <div className="flex flex-row rounded-md border border-transparent bg-dwhite px-4 py-2">
        <div className="flex flex-1 flex-row items-center gap-4">
          {/* total selected checkbox */}
          <Checkbox
            checked={hasChecked}
            indeterminate={hasChecked && isPartial}
            onChange={() => {
              if (!isPartial) select.selectNone();
              else select.selectAll();
            }}
            aria-label="select all"
          />

          <div className="text-sm text-slate-500">
            <span>{select.count()}</span>
            <span className="hidden sm:inline"> selected</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-row items-center gap-3">
          {/* selected actions */}
          <Tooltip label="Rename">
            <ActionIcon
              aria-label="rename file"
              disabled={!isOne || hasFolder}
              size="sm"
              variant="subtle"
              onClick={() => setModal('RENAME')}
            >
              <IconPencilMinus />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Move/Copy">
            <ActionIcon
              aria-label="move or copy selected files"
              disabled={!hasChecked || hasFolder}
              size="sm"
              variant="subtle"
              onClick={() => setModal('MOVE')}
            >
              <IconFileImport />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete">
            <ActionIcon
              aria-label="delete selected files"
              disabled={!hasChecked}
              size="sm"
              variant="subtle"
              onClick={async () => {
                setModal('DELETE');
                const success = await confirmAndDelete(
                  folderParsed,
                  select.getSelected(),
                );
                setModal(success ? 'RESET_MODALS' : null);
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Tooltip>

          <div className="h-full border-l border-slate-300"></div>

          {/* generic actions */}
          <Tooltip label="Add Folder">
            <ActionIcon
              onClick={() => setModal('NEW_FOLDER')}
              aria-label="add a folder"
              size="sm"
              variant="subtle"
            >
              <IconFolderPlus />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Add Files">
            <ActionIcon
              onClick={() => setModal('NEW_FILE')}
              aria-label="add files"
              size="sm"
              variant="filled"
            >
              <IconPlus />
            </ActionIcon>
          </Tooltip>

          {/* ACTION MODALS */}
          {modal !== 'RESET_MODALS' && (
            <>
              <UploadModal {...modalProps} show={modal === 'NEW_FILE'} />
              <NewFolderModal {...modalProps} show={modal === 'NEW_FOLDER'} />
              <RenameModal
                {...modalProps}
                show={modal === 'RENAME'}
                path={select.getSelected()[0]}
                folderContents={
                  files?.map(({ path }) => path.replace(folderParsed, '')) ?? []
                }
              />
              <MoveCopyModal
                {...modalProps}
                show={modal === 'MOVE'}
                selected={select.getSelected()}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
