import { useMemo, useState } from 'react';
import { Image, Modal, SimpleGrid, Loader, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { IMAGE_TYPES } from '@epc/types/s3';
import mime from 'mime/lite';
import { MimeType } from '@epc/mime';

const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

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
        {query.isPending && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <Loader size="sm" />
          </div>
        )}

        {!query.isPending && !images.length && (
          <Alert color="gray" variant="light">
            No images found in <b>{folder}</b>
          </Alert>
        )}

        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="xs">
          {images.map((file) => (
            <div
              key={file.path}
              className="aspect-square cursor-pointer overflow-hidden rounded-md transition-opacity hover:opacity-80"
              onClick={() => handleImageClick(file.path)}
            >
              <Image
                src={getUrl(file.path)}
                alt={file.path}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </SimpleGrid>
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
          <div className="flex items-center justify-center p-2" onClick={close}>
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
