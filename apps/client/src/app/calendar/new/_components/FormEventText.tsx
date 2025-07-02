import { useEffect, useState } from 'react';

import { ActionIcon, TextInput, Textarea, Tooltip } from '@mantine/core';
import { IconRestore } from '@tabler/icons-react';

import { useFormCtx } from '../state/formCtx';
import { useDebouncedValue } from '@mantine/hooks';

const NAME_GUESS_DEBOUNCE_MS = 50;

const FormEventText = () => {
  const { guests, eventText, setEventText } = useFormCtx();

  // title guessing
  const dbv = useDebouncedValue(() => {
    if (!guests.length) return '';

    const count = guests.slice(1).reduce((total, { name: guest }) => {
      const m = guest.match(/(?:(.+), )*(.+)(?:,? and | & | \+ )(.+)/);
      let n = guest.length ? 1 : 0;
      if (m) n = m.slice(1).filter((item) => item !== undefined).length;
      return total + n;
    }, 1);
    return `${guests[0].name}${count > 1 ? ` + ${count - 1}` : ``}`;
  }, NAME_GUESS_DEBOUNCE_MS);
  const eventNameGuess = dbv[0] as any as string;

  // title textbox management
  const [isDefaultTitle, setIsDefaultTitle] = useState(!eventText.title.length);
  useEffect(() => {
    if (!isDefaultTitle) return;
    setEventText((o) => ({ ...o, title: eventNameGuess }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventNameGuess, isDefaultTitle]);
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDefaultTitle) setIsDefaultTitle(false);
    setEventText((o) => ({ ...o, title: e.target.value }));
  };

  return (
    <>
      <div className="flex flex-row items-end gap-2">
        <TextInput
          label="Calendar Event Name"
          description="This is how your stay will appear to people checking the calendar."
          value={eventText.title}
          onChange={handleTitleChange}
          className="flex-1"
        />
        <div className="flex-flex-row flex h-[2.25rem] items-center">
          <Tooltip label="Return to auto-generated title">
            <ActionIcon
              disabled={isDefaultTitle}
              onClick={() => setIsDefaultTitle(true)}
              className=""
              variant="light"
            >
              <IconRestore />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      <Textarea
        label="Calendar Event Description"
        description="Add anything else about your stay you’d like others to know."
        value={eventText.description}
        onChange={({ currentTarget: { value: v } }) =>
          setEventText((o) => ({ ...o, description: v }))
        }
        classNames={{
          input: 'h-48',
        }}
      />
    </>
  );
};
export default FormEventText;
