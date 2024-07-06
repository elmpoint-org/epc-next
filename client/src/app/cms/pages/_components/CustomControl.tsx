import { RichTextEditor } from '@mantine/tiptap';
import { type IconType } from '@/util/iconType';

export default function CustomControl({
  icon: Icon,
  label,
  onClick,
}: {
  label: string;
  icon: IconType;
  onClick?: () => void;
}) {
  return (
    <>
      <RichTextEditor.Control
        onClick={onClick}
        aria-label={label}
        title={label}
      >
        <Icon stroke={1.5} size="1rem" />
      </RichTextEditor.Control>
    </>
  );
}
