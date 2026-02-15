/* eslint-disable @next/next/no-img-element */
import { useCallback, useMemo, useState } from 'react';
import { Image, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { IMAGE_TYPES } from '@epc/types/s3';
import mime from 'mime/lite';
import { MimeType } from '@epc/mime';
import {
  GlobalKeyboardHandler,
  useGlobalKeyboardShortcuts,
} from '@/app/_ctx/globalKeyboard';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

export function PhotoGallery({ folder }: { folder: string }) {
  // images query
  const query = useGraphQuery(
    graphql(`
      query GalleryFiles($root: String, $recursive: Boolean) {
        cmsFiles(root: $root, recursive: $recursive) {
          files {
            path
            presignedURL
          }
        }
      }
    `),
    { root: folder, recursive: false },
    { enabled: !!folder && folder.length > 1 },
  );

  const images = useMemo(() => {
    if (!query.data?.cmsFiles?.files) return [];
    return query.data.cmsFiles.files.filter((f) =>
      IMAGE_TYPES.includes(mime.getType(f.path) as MimeType),
    );
  }, [query.data?.cmsFiles?.files]);

  // modal state
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImg, setSelectedImg] = useState<number | null>(null);
  const handleImageClick = (index: number) => {
    setSelectedImg(index);
    open();
  };

  const handleShortcut = useCallback<GlobalKeyboardHandler>(
    (e, { withModifiers }) => {
      if (selectedImg === null) return;
      switch (e.code) {
        case 'ArrowLeft':
          if (withModifiers) break;
          setSelectedImg((v) => (v! + images.length - 1) % images.length);
          break;
        case 'ArrowRight':
          if (withModifiers) break;
          setSelectedImg((v) => (v! + images.length + 1) % images.length);
          break;
      }
    },
    [images.length, selectedImg],
  );
  useGlobalKeyboardShortcuts(handleShortcut);

  if (!folder) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg bg-slate-100 p-8 text-slate-400">
        <IconPhoto size={48} className="mb-2 opacity-50" />
        <span className="text-sm">Enter a folder path to load images</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        {!query.isPending && !images.length && (
          <Alert color="gray" variant="light">
            No images found
          </Alert>
        )}

        {/* image grid */}
        <div className="grid grid-cols-3 gap-0.5">
          {images.map((file, ind) => (
            <button
              key={file.path}
              className="relative aspect-square cursor-pointer overflow-hidden transition-opacity hover:opacity-80"
              onClick={() => handleImageClick(ind)}
            >
              <Image
                src={file.presignedURL}
                alt=""
                className="!my-0 !size-full !rounded-none !object-cover"
                loading="lazy"
              />
            </button>
          ))}

          {query.isPending &&
            Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square w-full animate-pulse rounded-md bg-slate-200"
              />
            ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={opened} onClose={close} className="relative z-[200]">
        <DialogBackdrop className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="bg-black">
            {selectedImg !== null && (
              <div
                className="flex flex-col items-center justify-center"
                onClick={close}
              >
                <img
                  src={images[selectedImg].presignedURL ?? '#'}
                  alt="image"
                  className="!static max-h-[85dvh] !w-auto rounded-sm bg-slate-200 !object-contain"
                />
              </div>
            )}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
