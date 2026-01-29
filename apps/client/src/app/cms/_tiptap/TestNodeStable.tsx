import { TextInput } from '@mantine/core';
import { clx } from '@/util/classConcat';
import A from '@/app/_components/_base/A';
import { ReactNodeViewProps } from '@tiptap/react';
import { TestNodeAtts } from './testNodeExt';

export default function TestNodeStable(
  props: ReactNodeViewProps<HTMLDivElement>,
) {
  const attrs = props.node.attrs as TestNodeAtts;

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
        defaultValue={attrs.myText}
        // value={attrs.myText}
        // onChange={handleChange}
      />
    </div>
  );
}
