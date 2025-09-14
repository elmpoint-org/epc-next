import {
  Button,
  CloseButton,
  Pill,
  PillsInput,
  TextInput,
} from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import TextboxSkeleton from '../../../_components/TextboxSkeleton';
import { type EditFormProps } from './PageEditForm';
import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { useEffect, useState } from 'react';

export default function TextFields({
  form,
  updateForm,
  serverPage,
}: EditFormProps) {
  const isSkeleton = useSkeleton();

  // auto slug generation
  const [isAutoSlug, setIsAutoSlug] = useState(false);
  useEffect(() => {
    if (isAutoSlug)
      updateForm({ slug: formatSlug(form.title, 'STRIP', 'NO_SLASH') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, isAutoSlug]);
  function changeSlug(ns: string) {
    if (isAutoSlug) setIsAutoSlug(false);
    updateForm({ slug: formatSlug(ns) });
  }
  function formatSlug(newSlug: string, ...opts: ('STRIP' | 'NO_SLASH')[]) {
    let ns = newSlug
      .toLowerCase()
      .replace(/[^a-z0-9\/]/g, '-')
      .replace(/([-\/]){2,}/g, '$1');
    if (opts.includes('NO_SLASH')) ns = ns.replace(/\//g, '-');
    if (opts.includes('STRIP')) ns = ns.replace(/^-+|-+$/g, '');
    return ns;
  }

  // protect slug
  const [isProtected, setIsProtected] = useState(true);

  // turn on autoslug if new page
  useEffect(() => {
    if (!isSkeleton && !form.slug.length) {
      setIsAutoSlug(true);
      setIsProtected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSkeleton]);

  // turn off autoslug if just saved
  useEffect(() => {
    if (serverPage?.slug?.length) {
      setIsAutoSlug(false);
      setIsProtected(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPage]);

  return (
    <>
      {/* page title input */}
      {isSkeleton ? (
        <TextboxSkeleton />
      ) : (
        <TextInput
          label="Page title"
          placeholder="Enter a title"
          value={form.title}
          onChange={({ currentTarget: { value: v } }) =>
            updateForm({ title: v })
          }
          rightSection={
            <CloseButton onClick={() => updateForm({ title: '' })} />
          }
        />
      )}

      {/* permalink/slug input */}
      {isSkeleton ? (
        <TextboxSkeleton />
      ) : (
        <PillsInput
          label="Permalink"
          disabled={isProtected}
          rightSectionPointerEvents="all"
          rightSection={
            isProtected ? (
              <Button
                size="compact-xs"
                variant="light"
                classNames={{
                  root: 'mx-2 rounded-full uppercase',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setIsProtected(false);
                }}
              >
                change
              </Button>
            ) : (
              <CloseButton
                icon={<IconRestore size={20} />}
                onClick={() => setIsAutoSlug(true)}
                disabled={isAutoSlug}
                className="disabled:text-slate-500"
                title="Revert to automatic permalink"
              />
            )
          }
          classNames={{
            wrapper: 'group',
            input: 'data-disabled:text-dblack!',
            section: 'group-data-disabled:data-[position=right]:w-auto',
          }}
        >
          {/* link prefix */}
          <Pill.Group>
            <Pill
              size="md"
              className="p-0 text-slate-500"
              classNames={{
                root: 'bg-transparent',
                label: '-mr-2 -mb-px',
              }}
            >
              <span className="hidden sm:inline">elmpoint.xyz</span>
              /pages/
            </Pill>
            {/* slug input */}
            <PillsInput.Field
              placeholder="page-link"
              value={form.slug}
              onChange={({ currentTarget: { value: v } }) => changeSlug(v)}
            />
          </Pill.Group>
        </PillsInput>
      )}
    </>
  );
}
