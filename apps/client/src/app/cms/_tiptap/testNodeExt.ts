import { mergeAttributes, Node } from '@tiptap/core';
import { AddAttributes, getTypedAtt } from '../_util/extensionUtils';

export const TestNodeTypeName = 'testNode';
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    testNode: {
      insertTestNode: (pos: number) => ReturnType;
    };
  }
}

export type TestNodeAtts = {
  myText: string;
};
type Atts = TestNodeAtts;
const att = getTypedAtt<Atts>();

const DATA_NAME = 'data-node-testnode';
export const TestNode = Node.create({
  name: TestNodeTypeName,
  group: 'block',
  atom: true,

  addAttributes(): AddAttributes<Atts> {
    return {
      myText: att({ att: 'myText', data: 'data-my-text', default: '' }),
    };
  },
  addCommands() {
    return {
      insertTestNode:
        (pos) =>
        ({ commands }) =>
          commands.insertContentAt(pos, {
            type: TestNodeTypeName,
          }),
    };
  },

  parseHTML() {
    return [{ tag: `div[${DATA_NAME}]` }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        [DATA_NAME]: '',
        style: `height: calc(${48} * 0.25rem)`,
      }),
    ];
  },
});
