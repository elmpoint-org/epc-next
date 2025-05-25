import plugin from 'tailwindcss/plugin';

export const tiptapSelectors = plugin(({ addVariant }) => {
  addVariant('pm-selected', '&.ProseMirror-selectednode');
  addVariant('pmg-selected', '&:global(.ProseMirror-selectednode)');
});
