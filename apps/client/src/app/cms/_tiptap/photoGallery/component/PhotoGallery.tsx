import { useMemo, useState } from 'react';
import { Image, Modal, SimpleGrid, Loader, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { IMAGE_TYPES } from '@epc/types/s3';
import mime from 'mime/lite';
import { MimeType } from '@epc/mime';

export function PhotoGallery({ folder }: { folder: string }) {
  // images query
  const query = useGraphQuery(
    graphql(`
      query GalleryFiles($root: String, $recursive: Boolean) {
        cmsFiles(root: $root, recursive: $recursive) {
          files {
            path
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
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const handleImageClick = (path: string) => {
    setSelectedImg(path);
    open();
  };

  const getUrl = (path: string) => `/cms/file/${path}`;

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
      <div className="relative min-h-[100px]">
        {!query.isPending && !images.length && (
          <Alert color="gray" variant="light">
            No images found
          </Alert>
        )}

        {/* image grid */}
        <div className="flex flex-row flex-wrap justify-center gap-2 *:max-w-56">
          {images.map((file) => (
            <button
              key={file.path}
              className="relative flex aspect-square cursor-pointer flex-col justify-center overflow-hidden rounded-md transition-opacity hover:opacity-80"
              onClick={() => handleImageClick(file.path)}
            >
              <Image
                src={getUrl(file.path)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}

          {query.isPending &&
            Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] w-full animate-pulse rounded-md bg-slate-200"
              />
            ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        centered
        withCloseButton={false}
        padding={0}
        styles={{ body: { backgroundColor: 'black' } }}
      >
        {selectedImg && (
          <div className="flex items-center justify-center" onClick={close}>
            <Image
              src={getUrl(selectedImg)}
              alt="Full size"
              fit="contain"
              className="max-h-[85vh] w-auto"
            />
          </div>
        )}
      </Modal>
    </>
  );
}
