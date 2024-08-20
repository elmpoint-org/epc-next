import { useEffect, useRef, useState } from 'react';

import { Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { FileModal, FileModalFooter, FileModalProps } from './FileModal';
import { useReverseCbTrigger } from '@/util/reverseCb';

import UploadFile from './UploadFile';

export default function UploadModal({
  show,
  onHide,
  currentFolder,
}: FileModalProps) {
  const filesRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isOnTop, setIsOnTop] = useState(false);

  function handleDomFileAdd() {
    const ref = filesRef.current;
    if (!ref?.files?.length) return;

    insertFileList(ref.files);
    ref.value = '';
  }
  function handleDragFileAdd(data: DataTransfer) {
    if (!data.files.length) return; // TODO check .items??
    insertFileList(data.files);
  }
  function insertFileList(fl: FileList) {
    for (let i = 0; i < fl.length; i++) {
      const file = fl.item(i);
      if (!file) continue;
      if (files.some((it) => it.name === file.name)) {
        notifications.show({
          color: 'red',
          message: 'Two files can’t have the same name.',
        });
        continue;
      }
      setFiles((f) => [...f, file]);
    }
  }

  // handle submissions

  const [finished, setFinished] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { prop: uplCb, trigger: startUpload } = useReverseCbTrigger();
  function handleSubmit() {
    if (finished.length) return onHide(true);

    setIsLoading(true);
    startUpload();
  }
  useEffect(() => {
    if (finished.length === files.length) setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  return (
    <>
      <FileModal
        open={show}
        onClose={() =>
          onHide(!!files.length && finished.length === files.length)
        }
        title="Upload Files"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex flex-col gap-2 text-sm">
            {/* instructions */}
            <p>Add files below to upload them into the current folder.</p>

            {/* files list */}
            <div>
              <h4 className="py-2 font-bold">Files</h4>
              <div className="flex flex-col gap-2">
                {files.map((it, i) => (
                  <UploadFile
                    key={i}
                    file={it}
                    startUpload={uplCb}
                    currentFolder={currentFolder}
                    onRemove={() =>
                      setFiles((f) => {
                        const nf = [...f];
                        nf.splice(i, 1);
                        return nf;
                      })
                    }
                    onComplete={() =>
                      setFinished((f) => {
                        if (!f.includes(it.name)) return [...f, it.name];
                        return [...f];
                      })
                    }
                  />
                ))}

                <div className="hidden px-2 py-1 italic text-slate-500 first:block">
                  no files yet.
                </div>
              </div>
            </div>

            {/* uploader */}
            <input
              type="file"
              id="dropzone"
              ref={filesRef}
              onChange={() => handleDomFileAdd()}
              multiple
              className="peer sr-only"
            />
            <label
              htmlFor="dropzone"
              className="my-2 flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-600/20 bg-slate-200 hover:border-slate-600 peer-focus:border-slate-600 data-[d]:border-slate-700 data-[d]:bg-slate-300"
              data-d={isOnTop || null}
              onDrop={(e) => {
                e.preventDefault();
                setIsOnTop(false);
                handleDragFileAdd(e.dataTransfer);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsOnTop(true)}
              onDragLeave={() => setIsOnTop(false)}
            >
              Drag files here or click
            </label>
          </div>

          {/* footer */}
          <div className="mt-4 space-y-4">
            <FileModalFooter>
              <div className="flex flex-row justify-end">
                <Button
                  type="submit"
                  disabled={!files.length}
                  loading={isLoading}
                >
                  {finished.length && !isLoading ? (
                    <span>Close</span>
                  ) : (
                    <span>Start uploading</span>
                  )}
                </Button>
              </div>
            </FileModalFooter>
          </div>
        </form>
      </FileModal>
    </>
  );
}
