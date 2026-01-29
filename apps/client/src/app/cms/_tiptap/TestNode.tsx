import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';

import type { TestNodeAtts } from './testNodeExt';

import { ActionIcon, TextInput } from '@mantine/core';
import { ChangeEventHandler, forwardRef, Ref, useCallback } from 'react';
import { clx } from '@/util/classConcat';
import { IconX } from '@tabler/icons-react';
import A from '@/app/_components/_base/A';

export default function TestNodeComponent(
  props: ReactNodeViewProps<HTMLDivElement>,
) {
  const attrs = props.node.attrs as TestNodeAtts;

  const handleChange = useCallback(
    (value: string) => {
      props.updateAttributes({
        myText: value,
      } satisfies Partial<TestNodeAtts>);
    },
    [props],
  );

  const deleteMe = useCallback(() => props.deleteNode(), [props]);

  return (
    <NodeViewWrapper>
      <div ref={props.ref} className="relative">
        <TestNodeStable value={attrs.myText} onChange={handleChange} />

        <div className="pmp-selected:visible invisible absolute -right-2 -top-2">
          <ActionIcon size="xs" color="slate" onClick={deleteMe}>
            <IconX />
          </ActionIcon>
        </div>
      </div>
    </NodeViewWrapper>
  );
}

export type TestNodeStableProps = {
  value: string;
  onChange?: (v: string) => void;
};
export function TestNodeStable({ value, onChange }: TestNodeStableProps) {
  return (
    <div
      className={clx(
        'relative my-2 flex flex-col gap-2 rounded-md bg-slate-200 p-4 text-sm',
        /* selected */ 'pmp-selected:border-slate-900 border border-transparent',
      )}
    >
      <div className="select-none">
        dynamic component. <A href="/">test</A>
      </div>
      <TextInput
        placeholder="hi"
        defaultValue={onChange ? undefined : value}
        value={onChange ? value : undefined}
        onChange={({ currentTarget: { value: v } }) => onChange?.(v)}
      />
    </div>
  );
}
