'use client';

import Link from 'next/link';

import { Table } from '@mantine/core';

import type { PagesType } from './PagesContainer';

import A from '@/app/_components/_base/A';
import BooleanStatus from '@/app/_components/_base/BooleanStatus';
import { clx } from '@/util/classConcat';
import { useSkeleton } from '@/app/_ctx/skeleton/context';

const STALE_PAGE_SECONDS = 0 * 3600;

export default function PagesList({
  pages,
  unused,
}: {
  pages: PagesType | null;
  unused?: boolean;
}) {
  const isSkeleton = useSkeleton();

  return (
    <>
      <div className="overflow-x-auto">
        <Table withRowBorders={false}>
          <Table.Thead className="border-b border-slate-200">
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Link</Table.Th>
              <Table.Th>Published</Table.Th>
              <Table.Th>Secure</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {!isSkeleton &&
              pages?.length &&
              pages
                .filter((it) => {
                  if (!unused) return it?.slug?.length;
                  return (
                    it &&
                    !it.slug?.length &&
                    Date.now().valueOf() / 1000 - it.timestamp.updated >
                      STALE_PAGE_SECONDS
                  );
                })
                .sort((a, b) => b!.timestamp.created - a!.timestamp.created)
                .map((p, i) => {
                  const page = p!;
                  return (
                    <Table.Tr
                      key={page.id}
                      className={clx(
                        'even:bg-slate-200/50',
                        'first:*:rounded-l-md last:*:rounded-r-md',
                      )}
                    >
                      <Table.Td className="select-none text-slate-500">
                        {i + 1}
                      </Table.Td>
                      <Table.Td>
                        <A href={`/cms/pages/edit/${page.id}`}>
                          {page.title || <i>click to edit</i>}
                        </A>
                      </Table.Td>
                      <Table.Td>
                        {page.slug?.length && (
                          <Link href={`/pages/${page.slug}`}>
                            /pages/{page.slug}
                          </Link>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <BooleanStatus
                          value={page.publish}
                          className="text-slate-400 data-[true]:text-dblack"
                        />
                      </Table.Td>
                      <Table.Td>
                        <BooleanStatus
                          value={page.secure}
                          className="text-slate-400 data-[true]:text-dblack"
                        />
                      </Table.Td>
                    </Table.Tr>
                  );
                })}

            {/* skeleton state */}
            {isSkeleton &&
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <Table.Tr key={i}>
                    <SkeletonCell index={i} className="w-4" />
                    <SkeletonCell index={i} className="w-56" />
                    <SkeletonCell index={i} className="w-48" />
                    <SkeletonCell index={i} className="w-6" />
                    <SkeletonCell index={i} className="w-6" />
                  </Table.Tr>
                ))}

            {/* empty state */}
            <Table.Tr className="hidden first:block">
              <Table.Td className="p-6 italic">none found</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
}

function SkeletonCell({
  className,
  index,
}: {
  className?: string;
  index?: number;
}) {
  return (
    <Table.Td
      className={clx('', className)}
      style={{ opacity: 1 - (index ?? 0) * 0.15 }}
    >
      <div className="my-1 h-4 w-full animate-pulse rounded-full bg-slate-200" />
    </Table.Td>
  );
}
