import { ReactNodeViewRenderer } from '@tiptap/react';
import { TestNode } from './testNodeExt';
import TestNodeComponent from './TestNode';

export const TestNodeDynamic = TestNode.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TestNodeComponent);
  },
});
