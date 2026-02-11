import { useMemo, useState } from 'react';
import { Image, Modal, SimpleGrid, Loader, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPhoto } from '@tabler/icons-react';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';

// Reusing the query structure from FileManager.tsx
const GET_GALLERY_FILES = graphql(`
  query GalleryFiles($root: String, $recursive: Boolean) {
    cmsFiles(root: $root, recursive: $recursive) {
      files {
        path
      }
    }
  }
`);

const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

export function PhotoGalleryStable({ folderPath }: { folderPath: string }) {
  // 1. Prepare path (logic borrowed from FileManager.tsx)
  const rootPath = useMemo(() => {
    let f = folderPath.trim();
    if (!f) return '';
    // Ensure trailing slash for folder query
    if (f.at(-1) !== '/') f = f + '/';
    // Remove leading slash for API consistency if needed (checking FileManager logic)
    if (f.at(0) === '/') f = f.slice(1);
    return f;
  }, [folderPath]);

  // 2. Data Fetching
  const query = useGraphQuery(
    GET_GALLERY_FILES,
    { root: rootPath, recursive: false },
    {
      enabled: !!rootPath && rootPath.length > 1,
    },
  );

  // 3. Filter for Images
  const images = useMemo(() => {
    if (!query.data?.cmsFiles?.files) return [];
    return query.data.cmsFiles.files.filter((f) => {
      const ext = f.path.split('.').pop()?.toLowerCase();
      return ext && ALLOWED_EXTS.includes(ext);
    });
  }, [query.data?.cmsFiles?.files]);

  // 4. Lightbox State
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const handleImageClick = (path: string) => {
    setSelectedImg(path);
    open();
  };

  // 5. Helper to get URL (Assuming standard CMS file route pattern)
  const getUrl = (path: string) => `/cms/file/${path}`;

  if (!folderPath) {
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
            No images found in <b>{rootPath}</b>
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
