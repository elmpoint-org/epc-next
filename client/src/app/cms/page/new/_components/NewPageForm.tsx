'use client';

import {
  CloseButton,
  Pill,
  PillsInput,
  Switch,
  TextInput,
} from '@mantine/core';

import TextEditor from './TextEditor';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { IconRestore } from '@tabler/icons-react';

export default function NewPageForm() {
  // form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [shouldAddContributor, setShouldAddContributor] = useState(true);

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
          value={title}
          onChange={({ currentTarget: { value: v } }) => setTitle(v)}
          rightSection={<CloseButton onClick={() => setTitle('')} />}
        />

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
              <span className="hidden sm:inline">elmpoint.xyz</span>/content/
            </Pill>
            <PillsInput.Field
              placeholder="page-link"
              value={isAutoSlug ? autoSlug : slug}
              onChange={({ currentTarget: { value: v } }) => changeSlug(v)}
            />
          </Pill.Group>
        </PillsInput>

        {/* checkbox options */}
        <div className="flex flex-col gap-2 rounded-[4px] border border-slate-300 p-3 px-4 sm:flex-row sm:items-center sm:gap-7">
          <p className="text-xs uppercase">options:</p>
          {(
            [
              ['Page requires login', isSecure, setIsSecure],
              [
                'Show me as a contributor',
                shouldAddContributor,
                setShouldAddContributor,
              ],
            ] as [string, boolean, Dispatch<SetStateAction<unknown>>][]
          ).map((it, i) => (
            <Switch
              key={i}
              checked={it[1]}
              onChange={() => it[2]((v: unknown) => !v)}
              label={it[0]}
              classNames={{
                input: 'peer',
                track:
                  '[.peer:not(:checked)~&]:border-slate-300 [.peer:not(:checked)~&]:bg-slate-300',
                thumb: 'border-0',
              }}
            />
          ))}
        </div>

        <TextEditor />
      </div>
    </>
  );
}
