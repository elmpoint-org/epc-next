'use client';

import Link from 'next/link';

import type { HomeLink } from '@/data/homeLinksData';
import {
  IconChevronRight,
  IconExternalLink,
  IconLock,
} from '@tabler/icons-react';
import { clx } from '@/util/classConcat';

export default function LinkBlock({ name, url, description, flags }: HomeLink) {
  const content = (
    <div
      data-h={flags.highlight || null}
      className={clx(
        'group flex h-full flex-col gap-2 rounded-lg border border-slate-300 p-5 hover:border-slate-800 hover:bg-black/5',
        /* highlight */ 'from-emerald-700 to-emerald-800 data-h:border-transparent data-h:bg-linear-to-b hover:data-h:to-emerald-900',
      )}
    >
      {/* link name */}
      <div className="flex flex-row items-center">
        <div className="flex flex-1 flex-row items-center gap-2">
          <div
            className={clx(
              'text-lg capitalize',
              /* highlight */ 'group-data-h:text-slate-200',
            )}
          >
            {name}
          </div>
          {/* secure icon */}
          {flags.secure && (
            <div
              className={clx(
                'text-slate-600',
                /* highlight */ 'group-data-h:text-slate-300',
              )}
            >
              <IconLock size={20} stroke={1.5} />
            </div>
          )}
          {/* external icon */}
          {flags.external && (
            <div
              className={clx(
                'text-slate-600',
                /* highlight */ 'group-data-h:text-slate-300',
              )}
            >
              <IconExternalLink size={20} stroke={1.5} />
            </div>
          )}
        </div>
        {/* link arrow */}
        <div
          className={clx(
            'text-slate-500 group-hover:text-dblack',
            /* highlight */ 'group-data-h:text-slate-300 group-data-h:group-hover:text-slate-100',
          )}
        >
          <IconChevronRight stroke={1} />
        </div>
      </div>

      {/* link description */}
      <div
        className={clx(
          'line-clamp-4 text-sm text-slate-600',
          /* highlight */ 'group-data-h:text-slate-200',
        )}
      >
        {description}
      </div>
    </div>
  );
  return !flags.external ? (
    <Link href={url || ''}>{content}</Link>
  ) : (
    <a href={url || ''} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  );
}
