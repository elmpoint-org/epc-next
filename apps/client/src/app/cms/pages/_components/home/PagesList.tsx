'use client';

import Link from 'next/link';

import { SegmentedControl, SegmentedControlItem, Table } from '@mantine/core';

import type { PagesType } from './PagesContainer';
import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { clx } from '@/util/classConcat';

import A from '@/app/_components/_base/A';
import BooleanStatus from '@/app/_components/_base/BooleanStatus';
import { useState } from 'react';
import { Inside } from '@/util/inferTypes';

const STALE_PAGE_SECONDS = 2 * 3600;

export default function PagesList({
  pages,
  unused,
}: {
  pages: PagesType | null;
  unused?: boolean;
}) {
  const isSkeleton = useSkeleton();

  // list sorting
  type SortBy = 'UPDATED' | 'CREATED' | 'SLUG' | 'TITLE';
  const [sortBy, setSortBy] = useState<SortBy>(unused ? 'CREATED' : 'SLUG');
  function sorter(a: Inside<PagesType>, b: Inside<PagesType>) {
    if (!(a && b)) return 0;
    switch (sortBy) {
      case 'SLUG':
        if ((a.slug ?? '') < (b.slug ?? '')) return -1;
        if ((a.slug ?? '') > (b.slug ?? '')) return 1;
        return 0;

      case 'TITLE':
        if ((a.title ?? '') < (b.title ?? '')) return -1;
        if ((a.title ?? '') > (b.title ?? '')) return 1;
        return 0;

      case 'CREATED':
        return b.timestamp.created - a.timestamp.created;

      case 'UPDATED':
        return b.timestamp.updated - a.timestamp.updated;

      default:
        return 0;
    }
  }

  return (
    <>
      {/* sort options */}
      {!unused && (
        <div className="flex flex-col gap-2 px-2 sm:flex-row sm:items-center">
          <div className="text-sm text-slate-600">sort by:</div>
          <SegmentedControl
            color="emerald"
            size="xs"
            value={sortBy}
            onChange={(s) => setSortBy(s as SortBy)}
            data={
              [
                { value: 'SLUG', label: 'Link' },
                { value: 'TITLE', label: 'Title' },
                { value: 'UPDATED', label: 'Date Modified' },
                { value: 'CREATED', label: 'Date Created' },
              ] as (SegmentedControlItem & { value: SortBy })[]
            }
          />
        </div>
      )}

      {/* table container */}
      <div className="overflow-x-auto">
        <Table withRowBorders={false}>
          {/* table headers */}
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
            {/* table data */}
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
                .sort(sorter)
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
                      <Table.Td className="max-w-[28ch] truncate whitespace-nowrap">
                        <A href={`/cms/pages/edit/${page.id}`}>
                          {sortBy === 'SLUG' && (
                            <span
                              className="inline-block"
                              style={{
                                width: `calc(1rem * ${page.slug?.match(/\//g)?.length ?? 0})`,
                              }}
                            />
                          )}
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
              <Table.Td className="whitespace-nowrap p-6 italic">
                none found
              </Table.Td>
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
