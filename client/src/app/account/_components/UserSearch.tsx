'use client';

import { useCallback, useMemo, useState } from 'react';
import Fuse, { FuseResult, FuseResultMatch } from 'fuse.js';

import {
  CheckIcon,
  CloseButton,
  Combobox,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { alphabetical } from '@/util/sort';
import { clx } from '@/util/classConcat';
import { IconLoader2 } from '@tabler/icons-react';
import { ResultOf } from '@graphql-typed-document-node/core';
import { Inside } from '@/util/inferTypes';

const MAX_DISPLAYED = 3;

const USERS_QUERY = graphql(`
  query Users {
    users {
      id
      email
      name
      firstName
      avatarUrl
    }
  }
`);
type SearchUserType = Inside<ResultOf<typeof USERS_QUERY>['users']>;

export function UserSearchBox() {
  const query = useGraphQuery(USERS_QUERY);
  const users = useMemo(
    () => (query.data?.users ?? []).sort(alphabetical((it) => it.name ?? '')),
    [query.data?.users],
  );

  const fuse = useMemo(
    () =>
      new Fuse(users ?? [], {
        keys: ['name', 'email', 'firstName'],
        includeMatches: true,
      }),
    [users],
  );

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const handleSelect = useCallback((val: string) => {
    setSelected((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val],
    );
    setSearch('');
  }, []);
  const handleRemove = useCallback(
    (val: string) => setSelected((current) => current.filter((v) => v !== val)),
    [],
  );

  // render selected pills
  const selectedDOM = selected.map((id) => {
    const item = users?.find((it) => it.id === id);
    if (!item) return null;
    return (
      <CustomPill key={id} onRemove={() => handleRemove(id)}>
        {item.name}
      </CustomPill>
    );
  });

  // render dropdown options
  const optionsDOM = useMemo(
    () =>
      (search.length ? fuse.search(search) : [...(users ?? [])]).map((el) => {
        const item = 'item' in el ? el.item : el;
        return (
          <UserSearchOption
            key={item.id}
            item={item}
            result={'item' in el ? el : undefined}
            isChecked={selected.includes(item.id)}
          />
        );
      }),
    [fuse, search, selected, users],
  );

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        withinPortal={false}
      >
        <Combobox.DropdownTarget>
          {/* text input box */}

          <PillsInput onClick={() => combobox.openDropdown()}>
            <Pill.Group
              classNames={{
                group: 'items-stretch',
              }}
            >
              {/* currently selected pills */}
              {selectedDOM.slice(0, MAX_DISPLAYED)}
              {/* truncated pill */}
              {selectedDOM.length > MAX_DISPLAYED && (
                <CustomPill>
                  +{selectedDOM.length - MAX_DISPLAYED} more
                </CustomPill>
              )}

              {/* text input */}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  placeholder="Search for a user..."
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && search.length === 0) {
                      e.preventDefault();
                      handleRemove(selected[selected.length - 1]);
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        {/* dropdown */}
        <Combobox.Dropdown classNames={{ dropdown: 'border-slate-400' }}>
          <Combobox.Options>
            <ScrollArea.Autosize mah={150} offsetScrollbars="y" type="auto">
              {/* loading state */}
              {query.isPending && (
                <div className="flex flex-row items-center justify-center p-2 text-emerald-700">
                  <IconLoader2 className="animate-spin" />
                </div>
              )}

              {/* no search results */}
              {!query.isPending && !optionsDOM.length && (
                <Combobox.Empty>Nothing found...</Combobox.Empty>
              )}

              {/* dropdown options */}
              {optionsDOM}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}

function UserSearchOption({
  item,
  result,
  isChecked,
}: {
  item: SearchUserType;
  result?: FuseResult<SearchUserType>;
  isChecked?: boolean;
}) {
  const nameMatch = result?.matches?.find((it) => it.key === 'name');
  const nextMatch = result?.matches?.find((it) => it.key !== 'name');

  return (
    <>
      <Combobox.Option
        value={item.id}
        key={item.id}
        active={isChecked}
        className="group"
      >
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-1 flex-row items-center gap-2">
            <OptionImg src={item.avatarUrl ?? ''} />

            {/* user name */}
            {nameMatch ? (
              <span
                dangerouslySetInnerHTML={{ __html: highlight(nameMatch) }}
              />
            ) : (
              <span>{item.name}</span>
            )}

            {nextMatch && (
              <span className="t">
                <span className="mr-2 text-slate-400">&bull;</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: highlight(nextMatch),
                  }}
                ></span>
              </span>
            )}
          </div>

          {isChecked ? (
            <CheckIcon className="size-3 text-emerald-700 group-data-[combobox-selected]:text-dwhite" />
          ) : null}
        </div>
      </Combobox.Option>
    </>
  );
}

function CustomPill({
  onRemove,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & {
  /** add an onRemove callback to display the remove button */
  onRemove?: () => void;
}) {
  return (
    <>
      {/* pill */}
      <div
        className="flex cursor-default items-center rounded-full border border-slate-300 px-2"
        {...props}
      >
        {/* label */}
        <div className={clx('text-xs leading-none', onRemove && 'ml-0.5')}>
          {children}
        </div>

        {/* remove */}
        {onRemove && (
          <CloseButton
            onMouseDown={onRemove}
            variant="transparent"
            color="gray"
            size={22}
            iconSize={14}
            tabIndex={-1}
            className="-mr-1"
          />
        )}
      </div>
    </>
  );
}

function OptionImg({ src }: { src: string }) {
  return (
    <>
      <div
        className="size-5 rounded-full bg-slate-400 bg-contain"
        style={{
          backgroundImage: `url(${src})`,
        }}
      />
    </>
  );
}

function highlight(match: FuseResultMatch) {
  const text = (match.value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let result = '';
  let lastIndex = 0;

  match.indices.forEach(([start, end]) => {
    result += text.slice(lastIndex, start);
    result += `<b>${text.slice(start, end + 1)}</b>`;
    lastIndex = end + 1;
  });

  result += text.slice(lastIndex);
  return result;
}
