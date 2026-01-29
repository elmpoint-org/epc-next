import { Children } from '@/util/propTypes';
import { type MarkViewProps } from '@tiptap/react';
import Link from 'next/link';
import { MarkType, NodeType } from '@tiptap/core';
import { ReactNode } from 'react';

export default function LinkWrap(props: MarkProps) {
  const {
    mark: {
      attrs: { class: cn, ...attrs },
    },
    children,
  } = props;

  return (
    <>
      <Link href="###" className={cn} {...attrs}>
        {children}
      </Link>
    </>
  );
}

// mark props rebuilt from tiptap because they didn't bother to export them
type MarkProps<
  TMarkType = MarkType,
  TChildren = ReactNode | ReactNode[],
  TNodeType = NodeType,
> = {
  /**
   * The current mark to render
   */
  mark: TMarkType;
  /**
   * The children of the current mark
   */
  children?: TChildren;
  /**
   * The node the current mark is applied to
   */
  node: TNodeType;
  /**
   * The node the current mark is applied to
   */
  parent?: TNodeType;
};
