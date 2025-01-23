'use client';

import { useCallback, useMemo, useState } from 'react';
import { MemberUser, UserSearchBox } from '../../_components/UserSearch';
import { IconTrash, IconX } from '@tabler/icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { alphabetical } from '@/util/sort';

export default function FamilyMembers() {
  const [members, setMembers] = useState<MemberUser[]>([]);
  const membersSorted = useMemo(
    () => [...members].sort(alphabetical((it) => it.name ?? '')),
    [members],
  );

  const addMember = useCallback(
    (nu: MemberUser) => {
      if (!members.includes(nu)) setMembers((c) => [...c, nu]);
    },
    [members],
  );
  const removeMember = useCallback(
    (id: string) => setMembers((ms) => ms.filter((it) => it.id !== id)),
    [],
  );

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        {/* title */}
        <div className="flex flex-row items-center justify-between">
          <h3 className="px-2 text-lg">Family Members</h3>

          <div className="t">
            <UserSearchBox
              onSelect={addMember}
              omit={members.map((it) => it.id)}
            />
          </div>
        </div>

        {/* members list */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-2">
            {membersSorted.map((m) => (
              <div
                key={m.id}
                className="flex flex-row items-center gap-3 rounded-md border border-slate-300 px-4 py-2"
              >
                <div
                  className="size-5 rounded-full bg-slate-300 bg-contain"
                  style={{ backgroundImage: `url(${m.avatarUrl})` }}
                ></div>
                <div className="flex-1">{m.name}</div>

                <div className="flex gap-2">
                  <Tooltip label="Remove from family group">
                    <ActionIcon
                      aria-label="Remove from family group"
                      color="slate"
                      size="sm"
                      variant="subtle"
                      onClick={() => removeMember(m.id)}
                    >
                      <IconX />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </div>
            ))}

            <div className="mx-4 hidden italic text-slate-600 first:flex">
              no members
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
