'use client';

import { graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { Inside } from '@/util/inferTypes';
import { alphabetical } from '@/util/sort';
import { dayjs } from '@epc/date-ts/dayjs';
import { ResultOf } from '@graphql-typed-document-node/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconLoader2,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';

const USERS_LIST_QUERY = graphql(`
  query Users {
    users {
      id
      avatarUrl
      name
      email
      timestamp {
        created
      }
    }
  }
`);
type ListUser = Inside<ResultOf<typeof USERS_LIST_QUERY>['users']>;
type SortKey = keyof ListUser;

export default function UsersList() {
  const query = useGraphQuery(USERS_LIST_QUERY);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [ascending, setAscending] = useState(true);

  const users = useMemo(() => {
    if (!query.data?.users) return null;

    // SORT
    return [...query.data.users].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      if (sortKey === 'timestamp') {
        aVal = a.timestamp.created;
        bVal = b.timestamp.created;
      } else {
        aVal = a[sortKey]?.toLowerCase() ?? 0;
        bVal = b[sortKey]?.toLowerCase() ?? 0;
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return ascending ? comparison : -comparison;
    });
  }, [query.data?.users, sortKey, ascending]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setAscending(!ascending);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <>
      <h3 className="text-center text-lg font-bold">
        Active Users{' '}
        {users ? (
          <span className="font-normal text-slate-500">({users.length})</span>
        ) : null}
      </h3>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {users && (
                <table className="relative min-w-full divide-y divide-slate-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-3 pr-0">
                        <span className="sr-only">Avatar</span>
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-0"
                      >
                        <SortHeaderButton
                          onClick={() => handleSort('name')}
                          isActive={sortKey === 'name'}
                          isAscending={ascending}
                        >
                          Name
                        </SortHeaderButton>
                      </th>

                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                      >
                        <SortHeaderButton
                          onClick={() => handleSort('email')}
                          isActive={sortKey === 'email'}
                          isAscending={ascending}
                        >
                          Email
                        </SortHeaderButton>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                      >
                        <SortHeaderButton
                          onClick={() => handleSort('timestamp')}
                          isActive={sortKey === 'timestamp'}
                          isAscending={ascending}
                        >
                          Created
                        </SortHeaderButton>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {users.map((u) => (
                      <tr key={u.email}>
                        <td className="py-4">
                          <div
                            className="size-5 rounded-full bg-slate-400 bg-contain"
                            style={{
                              backgroundImage: `url(${u.avatarUrl})`,
                            }}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-0">
                          {u.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {u.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {dayjs
                            .unix(u.timestamp.created)
                            .format('MMM D, YYYY')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* LOADING STATE */}
              {query.isFetching && <Loader />}
            </div>
          </div>
        </div>
      </div>

      <hr className="my-2 text-slate-300" />

      {/* PREUSERS */}
      <PreUsersList />
    </>
  );
}

function PreUsersList() {
  const query = useGraphQuery(
    graphql(`
      query PreUsers {
        preUsers {
          email
        }
      }
    `),
  );
  const preusers = useMemo(() => {
    const preusers = query.data?.preUsers;
    if (!preusers) return null;
    return preusers.sort(alphabetical((it) => it.email));
  }, [query.data?.preUsers]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold">
        Invited Users{' '}
        {preusers ? (
          <span className="font-normal text-slate-500">
            ({preusers.length})
          </span>
        ) : null}
      </h3>

      <div className="flex flex-col gap-1 text-xs">
        {/* user list */}
        {preusers?.map(({ email }) => (
          <code key={email} className="">
            {email}
          </code>
        ))}

        {/* loader */}
        {query.isFetching && (
          <div className="max-w-8">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

function SortHeaderButton({
  onClick,
  isActive,
  isAscending,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  isAscending: boolean;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className="group inline-flex">
      {children}
      <span
        className={
          isActive
            ? 'ml-2 flex-none rounded bg-slate-200/80 text-slate-900 group-hover:bg-slate-200'
            : 'invisible ml-2 flex-none rounded text-slate-400 group-hover:visible group-focus:visible'
        }
      >
        {/* SORT ICON */}
        {isActive ? (
          isAscending ? (
            <IconChevronUp aria-hidden="true" className="size-5" />
          ) : (
            <IconChevronDown aria-hidden="true" className="size-5" />
          )
        ) : (
          <IconChevronDown aria-hidden="true" className="size-5" />
        )}
      </span>
    </button>
  );
}

function Loader() {
  return (
    <div className="mt-1 flex flex-col items-center justify-center">
      <IconLoader2 className="size-4 animate-spin text-slate-400" />
    </div>
  );
}
