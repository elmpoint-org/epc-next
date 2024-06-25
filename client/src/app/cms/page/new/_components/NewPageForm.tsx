'use client';

import { CloseButton, Pill, PillsInput, TextInput } from '@mantine/core';

import TextEditor from './TextEditor';
import { useMemo, useState } from 'react';
import { IconRestore } from '@tabler/icons-react';

export default function NewPageForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const autoSlug = useMemo(() => formatSlug(title, 'STRIP'), [title]);

  function formatSlug(newSlug: string, strip?: 'STRIP') {
    let ns = newSlug
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-{2,}/g, '-');
    if (strip) ns = ns.replace(/^-+|-+$/g, '');
    return ns;
  }
  function changeSlug(ns: string) {
    if (isAutoSlug) setIsAutoSlug(false);
    setSlug(formatSlug(ns));
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <TextInput
          label="Page title"
          placeholder="Enter a title"
          rightSection={<CloseButton onClick={() => setTitle('')} />}
          value={title}
          onChange={({ currentTarget: { value: v } }) => setTitle(v)}
        />
        <PillsInput
          label="Permalink"
          rightSection={
            <CloseButton
              icon={<IconRestore size={20} />}
              onClick={() => setIsAutoSlug(true)}
              disabled={isAutoSlug}
              className="disabled:text-slate-500"
            />
          }
        >
          <Pill.Group>
            <Pill
              size="md"
              className="p-0 text-slate-500"
              classNames={{
                label: '_bg-red-500/50 -mb-0.5 -mr-2',
              }}
            >
              <span className="hidden sm:inline">elmpoint.xyz</span>/content/
            </Pill>
            <PillsInput.Field
              placeholder="page-link"
              value={isAutoSlug ? autoSlug : slug}
              onChange={({ currentTarget: { value: v } }) => changeSlug(v)}
            />
          </Pill.Group>
        </PillsInput>

        <TextEditor />
      </div>
    </>
  );
}
