'use client';

import { useEffect, useMemo, useState } from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';

import { Slider } from '@mantine/core';

import { ImageTypeName } from '@/app/cms/_tiptap/image';

export default function ImageMenu({ editor }: { editor: Editor }) {
  const [value, setValue] = useState(100);
  const [isChanging, setIsChanging] = useState(false);
  const fullValue = isChanging ? value : getStoredWidth() ?? 100;

  function getStoredWidth() {
    const a = parseInt(editor.getAttributes(ImageTypeName).width);
    return Number.isFinite(a) ? a : null;
  }

  function handleChange(nv: number) {
    if (!isChanging) setIsChanging(true);
    setValue(nv);
  }
  function handleChangeEnd(nv: number) {
    let cmd = editor.chain().focus(undefined, { scrollIntoView: false });
    cmd = cmd.setImageBlockWidth(nv);
    cmd.run();

    setIsChanging(false);
  }

  return (
    <>
      <BubbleMenu
        editor={editor}
        shouldShow={() => editor.isActive(ImageTypeName)}
      >
        <div className="flex max-w-full flex-row items-center gap-2 rounded-lg border border-black/5 bg-dwhite px-3 py-2 shadow-sm">
          <Slider
            value={fullValue}
            onChange={handleChange}
            onChangeEnd={handleChangeEnd}
            min={10}
            max={100}
            step={5}
            label={null}
            classNames={{
              root: 'min-w-48',
            }}
          />

          <div className="text-sm">{fullValue}%</div>
        </div>
      </BubbleMenu>
    </>
  );
}
