import {
  ModalFrame,
  ModalFrameFooter,
} from '@/app/_components/_base/ModalFrame';
import { dateTS, TStoDate } from '@epc/date-ts';
import { Button, Checkbox } from '@mantine/core';
import {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { dayStyles } from '../_util/dayStyles';
import { DatePickerInput } from '@mantine/dates';
import { DatesRange } from '../new/state/formCtx';
import { CalendarProps, EventType } from './Calendar';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconMailFast } from '@tabler/icons-react';

type EmailsModalFormProps = Pick<
  CalendarProps,
  'dates' | 'events' | 'selectedDate'
>;
function EmailsModalForm({
  onClose,
  ...props
}: { onClose?: () => void } & EmailsModalFormProps) {
  const { dates: queryDates, events, selectedDate } = props;

  const [dates, setDates] = useState<DatesRange>([
    TStoDate(queryDates.start),
    TStoDate(queryDates.end),
  ]);

  const authorsList = useMemo(() => {
    const authors: AuthorType[] = [];
    if (!events) return authors;
    for (const e of events) {
      if (
        /* prettier-ignore */
        dates[0] && dates[1] &&
        !(e.dateStart <= dateTS(dates[1]) && e.dateEnd >= dateTS(dates[0]))
      )
        continue;
      if (e.author === null || authors.some((a) => a.id === e.author!.id))
        continue;
      authors.push(e.author);
    }
    return authors;
  }, [dates, events]);

  type AuthorMap = Map<string, boolean>;
  const [selectedAuthors, setSelectedAuthors] = useState<AuthorMap>(
    new Map(authorsList.map((a) => [a.id, true])),
  );
  useEffect(() => {
    setSelectedAuthors((prev) => {
      const updated: AuthorMap = new Map();
      for (const author of authorsList)
        updated.set(author.id, prev.get(author.id) ?? true);
      return updated;
    });
  }, [authorsList]);

  const makeEmailText = useCallback(
    (author: AuthorType, withComma?: boolean) =>
      `${author.name} <${author.email}>${withComma ? ',' : ''}`,
    [],
  );

  const handleCheckboxChange = useCallback(
    (authorId: string) => (event: ChangeEvent<HTMLInputElement>) =>
      setSelectedAuthors((prev) =>
        new Map(prev).set(authorId, event.target.checked),
      ),
    [],
  );

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      const text = authorsList
        .map((a, i) => {
          if (!selectedAuthors.get(a.id)) return '';
          return (!!i ? ',\n' : '') + makeEmailText(a);
        })
        .join('');
      navigator.clipboard.writeText(text);
      notifications.show({
        title: 'Success!',
        message: 'Email list copied to clipboard.',
        icon: <IconCheck />,
      });
      onClose?.();
    },
    [authorsList, makeEmailText, onClose, selectedAuthors],
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="prose prose-sm prose-slate my-2 max-w-none !leading-tight">
            <p>
              Emails are shown below for all users with reservations in the
              current timeframe.
            </p>
            <p>
              Select which emails to copy below. You can paste directly into the{' '}
              <code>to</code> field in your email client.
            </p>
          </div>

          <DateRangePicker
            dates={dates}
            showDate={selectedDate}
            onChange={setDates}
          />

          <hr className="border-slate-200" />

          <div className="flex flex-col gap-2 px-2">
            {authorsList.map((author, i) => (
              <div key={author.id} className="font-mono text-xs">
                <Checkbox
                  size="xs"
                  color="slate"
                  checked={selectedAuthors.get(author.id) ?? true}
                  onChange={handleCheckboxChange(author.id)}
                  label={makeEmailText(author, i < authorsList.length - 1)}
                />
              </div>
            ))}

            <div className="-mb-2 hidden text-center text-sm italic text-slate-500 first:block">
              none found
            </div>
          </div>

          <ModalFrameFooter>
            <div className="flex flex-row justify-end gap-2">
              <Button
                color="slate"
                variant="light"
                onClick={(e) => {
                  e.preventDefault();
                  onClose?.();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" data-autofocus>
                Copy emails
              </Button>
            </div>
          </ModalFrameFooter>
        </div>
      </form>
    </>
  );
}

type AuthorType = EventType['author'] & {};

export default function EmailsModal(props: EmailsModalFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-row justify-end">
        <button
          className="-mt-2 text-right text-xs italic text-slate-600 hover:underline focus:text-dblack focus:underline focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <IconMailFast
            className="-mt-px mr-0.5 inline-block size-5"
            stroke={1}
          />
          email visitors
        </button>
      </div>

      <ModalFrame
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={<>Email selected visitors</>}
      >
        <EmailsModalForm {...props} onClose={() => setIsOpen(false)} />
      </ModalFrame>
    </>
  );
}

function DateRangePicker({
  onChange,
  showDate,
  dates,
}: {
  dates: DatesRange;
  showDate?: number;
  onChange?: (nv: DatesRange) => void;
}) {
  const initialDates = useRef(dates);
  const [dateShown, setDateShown] = useState<Date | undefined>(
    showDate ? TStoDate(showDate) : undefined,
  );

  return (
    <DatePickerInput
      type="range"
      aria-label="dates to check"
      label="Include reservations between..."
      placeholder="Click to choose dates"
      value={dates}
      onChange={onChange}
      minDate={initialDates.current[0] ?? undefined}
      maxDate={initialDates.current[1] ?? undefined}
      date={dateShown}
      onDateChange={setDateShown}
      firstDayOfWeek={0}
      allowSingleDateInRange={true}
      classNames={{
        levelsGroup: 'popover:border-slate-300 popover:shadow-sm',
        day: dayStyles,
      }}
    />
  );
}
