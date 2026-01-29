import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { renderToReactElement } from '@tiptap/static-renderer/pm/react';
import { useState } from 'react';

// This component does not have a NodeViewContent, so it does not render it's children's rich text content
function MyCustomComponentWithoutContent() {
  const [count, setCount] = useState(200);

  return (
    <div
      className="custom-component-without-content"
      onClick={() => setCount((a) => a + 1)}
    >
      {count} This is a react component!
    </div>
  );
}

const CustomNodeExtensionWithoutContent = Node.create({
  name: 'customNodeExtensionWithoutContent',
  atom: true,
  renderHTML() {
    return ['div', { class: 'my-custom-component-without-content' }] as const;
  },
  addNodeView() {
    return ReactNodeViewRenderer(MyCustomComponentWithoutContent);
  },
});

renderToReactElement({
  extensions: [StarterKit, CustomNodeExtensionWithoutContent],
  options: {
    nodeMapping: {
      // render the custom node with the intended node view React component
      customNodeExtensionWithoutContent: MyCustomComponentWithoutContent,
    },
  },
  content: {
    type: 'doc',
    content: [
      {
        type: 'customNodeExtensionWithoutContent',
      },
    ],
  },
});
// returns: <div class="my-custom-component-without-content">200 This is a react component!</div>
