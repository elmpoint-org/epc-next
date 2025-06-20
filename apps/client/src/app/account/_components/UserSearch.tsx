'use client';

import { useCallback, useMemo, useState } from 'react';
import Fuse, { FuseResult, FuseResultMatch } from 'fuse.js';

import {
  Button,
  ButtonProps,
  CloseButton,
  Combobox,
  ScrollArea,
  useCombobox,
} from '@mantine/core';

import { useGraphQuery } from '@/query/query';
import { graphql } from '@/query/graphql';
import { alphabetical } from '@/util/sort';
import { clmx, clx } from '@/util/classConcat';
import { IconLoader2 } from '@tabler/icons-react';
import { ComboboxOptionProps } from '@headlessui/react';
import { usePending } from '@/util/usePending';
import { ResultOf } from 'gql.tada';

export const USER_FRAGMENT = graphql(`
  fragment MemberUser on User @_unmask {
    id
    email
    name
    firstName
    avatarUrl
  }
`);
export type MemberUser = ResultOf<typeof USER_FRAGMENT>;

export function UserSearchBox({
  omit,
  onSelection: onSelect,
  onClick,
  ...props
}: {
  omit?: string[];
  onSelection?: (newMemberId: string) => Promise<void>;
} & ButtonProps &
  React.ComponentPropsWithoutRef<'button'>) {
  const query = useGraphQuery(
    graphql(
      `
        query Users {
          users {
            ...MemberUser
          }
        }
      `,
      [USER_FRAGMENT],
    ),
  );

  const users = useMemo(() => {
    let u = query.data?.users ?? [];
    u.sort(alphabetical((it) => it.name ?? ''));
    return u;
  }, [query.data?.users]);

  const fuse = useMemo(
    () =>
      new Fuse(users ?? [], {
        keys: ['name', 'email', 'firstName'],
        includeMatches: true,
      }),
    [users],
  );

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      combobox.focusTarget();
      setSearch('');
    },
    onDropdownOpen: () => {
      combobox.focusSearchInput();
      combobox.updateSelectedOptionIndex('active');
    },
  });

  const [isPending, runPending] = usePending<string>();

  const [search, setSearch] = useState('');

  const handleSelect = useCallback(
    (id: string) => {
      runPending([id])(async () => await onSelect?.(id));
    },
    [onSelect, runPending],
  );

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
            disabled={omit?.includes(item.id)}
            isLoading={isPending(item.id)}
          />
        );
      }),
    [fuse, isPending, omit, search, users],
  );

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={handleSelect}
        width={350}
        position="bottom-end"
      >
        <Combobox.Target withAriaAttributes={false}>
          <Button
            {...props}
            onClick={(e) => {
              combobox.toggleDropdown();
              onClick?.(e);
            }}
          />
        </Combobox.Target>

        {/* dropdown */}
        <Combobox.Dropdown
          classNames={{
            dropdown: 'overflow-hidden rounded-md border-slate-300 shadow-sm',
          }}
        >
          <Combobox.Search
            value={search}
            onChange={({ currentTarget: { value: v } }) => setSearch(v)}
            placeholder="Search by name or email..."
            rightSection={<CloseButton onClick={() => setSearch('')} />}
            rightSectionPointerEvents="all"
          />

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
                <Combobox.Empty>No results</Combobox.Empty>
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
  isLoading,
  className,
  disabled,
  ...props
}: {
  item: MemberUser;
  result?: FuseResult<MemberUser>;
  isLoading?: boolean;
  className?: string;
} & Partial<ComboboxOptionProps>) {
  const nameMatch = result?.matches?.find((it) => it.key === 'name');
  const nextMatch = result?.matches?.find((it) => it.key !== 'name');

  return (
    <>
      <Combobox.Option
        value={item.id}
        key={item.id}
        className={clmx('group', className)}
        disabled={disabled || isLoading}
        {...props}
      >
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-1 flex-row items-center gap-4">
            {isLoading ? (
              <div className="flex animate-spin items-center justify-center">
                <IconLoader2 className="size-5" />
              </div>
            ) : (
              <OptionImg src={item.avatarUrl ?? ''} />
            )}

            <span className="[&_em]:font-semibold [&_em]:not-italic [&_em]:text-slate-700 group-data-[combobox-selected]:[&_em]:text-dwhite">
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
                  <span className="mx-1 text-slate-400"> &bull; </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlight(nextMatch),
                    }}
                  ></span>
                </span>
              )}
            </span>
          </div>
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
    result += `<em>${text.slice(start, end + 1)}</em>`;
    lastIndex = end + 1;
  });

  result += text.slice(lastIndex);
  return result;
}
