import { CloseButton, Pill, PillsInput, TextInput } from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import TextboxSkeleton from './TextboxSkeleton';
import { type EditFormProps } from './PageEditForm';
import { useSkeleton } from '@/app/_ctx/skeleton/context';
import { useEffect, useState } from 'react';

export default function TextFields({ form, updateForm }: EditFormProps) {
  const isSkeleton = useSkeleton();

  // auto slug generation
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  useEffect(() => {
    if (isAutoSlug) updateForm({ slug: formatSlug(form.title, 'STRIP') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title, isAutoSlug]);
  function changeSlug(ns: string) {
    if (isAutoSlug) setIsAutoSlug(false);
    updateForm({ slug: formatSlug(ns) });
  }
  function formatSlug(newSlug: string, strip?: 'STRIP') {
    let ns = newSlug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-{2,}/g, '-');
    if (strip) ns = ns.replace(/^-+|-+$/g, '');
    return ns;
  }

  return (
    <>
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

      {isSkeleton ? (
        <TextboxSkeleton />
      ) : (
        <PillsInput
          label="Permalink"
          rightSection={
            <CloseButton
              icon={<IconRestore size={20} />}
              onClick={() => setIsAutoSlug(true)}
              disabled={isAutoSlug}
              className="disabled:text-slate-500"
              title="Revert to automatic permalink"
            />
          }
        >
          <Pill.Group>
            <Pill
              size="md"
              className="p-0 text-slate-500"
              classNames={{
                root: 'bg-transparent',
                label: '-mb-0.5 -mr-2',
              }}
            >
              <span className="hidden sm:inline">elmpoint.xyz</span>
              /content/
            </Pill>
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
