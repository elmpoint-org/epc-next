'use client';

import ColorText from '@/app/_components/_base/ColorText';
import HomeBanner from '@/app/_components/home/HomeBanner';
import {
  ColorNames,
  HOME_BANNER_FRAGMENT,
  HomeBannerColor,
  HomeBannerType,
} from '@/app/_components/home/homeBanners';
import { datePickerBorder, dayStyles } from '@/app/calendar/_util/dayStyles';
import { graphAuth, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { clx } from '@/util/classConcat';
import { dateTS, TStoDate, unixNow } from '@epc/date-ts';
import {
  ActionIcon,
  Button,
  CloseButton,
  Collapse,
  NativeSelect,
  Textarea,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconLoader2,
  IconPlus,
  IconRestore,
  IconTrash,
} from '@tabler/icons-react';
import {
  FormEventHandler,
  MouseEventHandler,
  useCallback,
  useMemo,
  useState,
} from 'react';
import fdeq from 'fast-deep-equal';
import { useLoading } from '@/util/useLoading';
import { notifications } from '@mantine/notifications';
import { prettyErrorPlaceholder } from '@/util/prettyErrors';
import { confirmModal } from '@/app/_components/_base/modals';

export default function BannersList() {
  const query = useGraphQuery(
    graphql(
      `
        query CmsBanners {
          cmsBanners {
            ...HomeBanner
          }
        }
      `,
      [HOME_BANNER_FRAGMENT],
    ),
  );
  const banners = useMemo(
    () => query.data?.cmsBanners,
    [query.data?.cmsBanners],
  );

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return (
    <>
      <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-6">
        {/* instructions */}
        <div className="my-4 flex flex-row gap-4">
          <p className="mt-0.5 flex-1">
            Homepage alerts are for displaying{' '}
            <ColorText>highly-visible messages</ColorText> on the website home
            page. Click on one to edit it. All fields are optional except for
            the body text. Banners will be deleted on their End Date, if
            specified.
          </p>

          <CreateBannerButton refetch={refetch} />
        </div>

        <div className="flex flex-col gap-4 rounded-lg sm:px-4">
          {banners?.map((b) => (
            <BannerEditor key={b.id} initialValue={b} refetch={refetch} />
          ))}

          {query.isPending && (
            <div className="flex flex-col items-center">
              <IconLoader2
                className="size-5 animate-spin text-slate-500"
                stroke={1.75}
              />
            </div>
          )}

          <div className="hidden text-center text-sm italic text-slate-700 first:block">
            none found
          </div>
        </div>
      </div>
    </>
  );
}

function BannerEditor({
  initialValue,
  refetch,
}: {
  initialValue: HomeBannerType;
  refetch: Refetch;
}) {
  const [banner, setBanner] = useState(initialValue);
  const updateBanner = useCallback(
    (v: Partial<HomeBannerType>) => setBanner((c) => ({ ...c, ...v })),
    [],
  );
  const updateLink = useCallback(
    (link: Partial<HomeBannerType['link'] & {}>) =>
      setBanner((c) => {
        let obj = structuredClone(c);
        if (!obj.link) obj.link = { href: '', text: '' };
        if (typeof link.href === 'string') obj.link.href = link.href;
        if (typeof link.text === 'string') obj.link.text = link.text;
        if (!obj.link.href.length && !obj.link.text.length) obj.link = null;
        return obj;
      }),
    [],
  );

  const [isOpen, setIsOpen] = useState(!initialValue.text.length);

  const [isLoading, loading] = useLoading();
  const state = useMemo<'SAVED' | 'UNSAVED' | 'LOADING'>(() => {
    if (isLoading) return 'LOADING';
    if (!fdeq(banner, initialValue)) return 'UNSAVED';
    return 'SAVED';
  }, [banner, initialValue, isLoading]);

  const handleSave = useCallback<FormEventHandler>(
    (e) => {
      e.preventDefault();
      loading(async () => {
        if (
          banner.date_end &&
          banner.date_start &&
          banner.date_end - banner.date_start < 0
        ) {
          notifications.show({
            color: 'red',
            message: 'The end date must be later than the start date.',
          });
          return;
        }

        const { data, errors } = await graphAuth(
          graphql(`
            mutation CmsBannerUpdate(
              $id: ID!
              $text: String
              $link: CMSBannerLinkInput
              $color: CMSBannerColor
              $date_start: Int
              $date_end: Int
            ) {
              cmsBannerUpdate(
                id: $id
                text: $text
                link: $link
                color: $color
                date_start: $date_start
                date_end: $date_end
              ) {
                id
              }
            }
          `),
          banner,
        );
        if (errors || !data?.cmsBannerUpdate) {
          notifications.show({
            color: 'red',
            message: prettyErrorPlaceholder(errors?.[0]?.code),
          });
          return;
        }

        await refetch();
      });
    },
    [banner, loading, refetch],
  );

  return (
    <div className={clx('flex flex-col transition-all')}>
      <button
        className="=ring-offset-2 z-10 rounded-lg text-left ring-slate-300 focus:outline-none focus:ring-2"
        onClick={() => setIsOpen((c) => !c)}
      >
        <HomeBanner {...banner} />
      </button>
      <Collapse in={isOpen}>
        <form
          onSubmit={handleSave}
          className="relative -mt-4 flex flex-col gap-2 rounded-lg border border-slate-300 p-4 pt-6"
        >
          {/* form action buttons */}
          <div className="absolute right-4 top-8 flex flex-row items-center justify-end gap-2">
            {/* SAVE/RESTORE */}

            <Tooltip label="Reset to saved">
              <ActionIcon
                aria-label="reset to saved"
                variant="subtle"
                className="data-[disabled]:invisible"
                disabled={state !== 'UNSAVED'}
                onClick={() => updateBanner(initialValue)}
              >
                <IconRestore className="h-5" />
              </ActionIcon>
            </Tooltip>
            <Button
              type="submit"
              size="compact-md"
              disabled={state !== 'UNSAVED'}
              loading={state === 'LOADING'}
              onClick={() => {} /* // TODO */}
            >
              Save
            </Button>

            <div className="-mr-0.5 ml-0.5 self-stretch border-r border-slate-200" />

            {/* DELETE */}
            <DeleteBannerButton id={banner.id} refetch={refetch} />
          </div>
          <div className="h-5 md:hidden" />

          {/* form */}
          <div className="flex flex-col gap-3 md:flex-row">
            <Textarea
              value={banner.text}
              onChange={(e) => updateBanner({ text: e.currentTarget.value })}
              label="Message"
              placeholder="Type your message here..."
              required
              className="flex-1"
              classNames={{
                input: 'min-h-40',
                // wrapper:'min-h-full',
              }}
            />

            <div className="flex flex-row gap-2 *:flex-1 md:flex-col md:justify-end *:md:flex-grow-0">
              <TextInput
                value={banner.link?.href ?? ''}
                onChange={({ currentTarget: { value: v } }) =>
                  updateLink({ href: v })
                }
                label="Link URL"
                placeholder="https://elmpoint.org/"
              />
              <TextInput
                value={banner.link?.text ?? ''}
                onChange={({ currentTarget: { value: v } }) =>
                  updateLink({ text: v })
                }
                label="Link Text"
                placeholder="Go"
              />
            </div>
          </div>
          <hr className="mt-2 md:hidden" />
          <div className="flex flex-row flex-wrap gap-3 *:md:flex-1">
            <DatePickerInput
              value={banner.date_start ? TStoDate(banner.date_start) : null}
              onChange={(v) =>
                updateBanner({ date_start: v ? dateTS(v) : null })
              }
              rightSection={
                <CloseButton
                  onClick={() => updateBanner({ date_start: null })}
                />
              }
              firstDayOfWeek={0}
              classNames={{
                day: dayStyles,
                ...datePickerBorder,
                placeholder: 'italic',
              }}
              label="Start Date"
              placeholder="Default: Immediately"
              description="When to start showing this alert"
              className="flex-grow-[1]"
            />
            <DatePickerInput
              value={banner.date_end ? TStoDate(banner.date_end) : null}
              onChange={(v) => updateBanner({ date_end: v ? dateTS(v) : null })}
              rightSection={
                <CloseButton onClick={() => updateBanner({ date_end: null })} />
              }
              minDate={TStoDate(dateTS(unixNow()))}
              firstDayOfWeek={0}
              classNames={{
                day: dayStyles,
                ...datePickerBorder,
                placeholder: 'italic',
              }}
              label="End Date"
              placeholder="Default: Never"
              description="When to stop showing this alert"
              className="flex-grow-[1]"
            />
            <NativeSelect
              value={banner.color ?? ''}
              onChange={({ currentTarget: { value: v } }) =>
                updateBanner({
                  color: (v.length ? v : null) as HomeBannerColor,
                })
              }
              label="Color"
              description="Choose an alert style"
              data={['', ...ColorNames]}
              classNames={{
                input: 'capitalize',
              }}
            />
          </div>
        </form>
      </Collapse>
    </div>
  );
}

function DeleteBannerButton({ id, refetch }: { id: string; refetch: Refetch }) {
  const [isLoading, loading] = useLoading();

  const handleDelete = useCallback<MouseEventHandler>(
    async (e) => {
      e.preventDefault();
      const confirmed = await confirmModal({
        body: <>Are you sure you want to permanently delete this alert?</>,
        color: 'red',
        buttons: { confirm: 'Delete' },
        focusOnConfirm: true,
      });
      if (!confirmed) return;
      loading(async () => {
        const { errors, data } = await graphAuth(
          graphql(`
            mutation CmsBannerDelete($id: ID!) {
              cmsBannerDelete(id: $id) {
                id
              }
            }
          `),
          { id },
        );
        if (errors || !data?.cmsBannerDelete) {
          notifications.show({
            color: 'red',
            message: prettyErrorPlaceholder(errors?.[0]?.code),
          });
          return;
        }

        await refetch();
      });
    },
    [id, loading, refetch],
  );

  return (
    <Tooltip label="Delete">
      <ActionIcon
        aria-label="Delete"
        variant="subtle"
        color="red"
        className="text-slate-500 hover:text-red-700 focus:text-red-700 focus:outline-red-700"
        loading={isLoading}
        onClick={handleDelete}
      >
        <IconTrash className="h-5" />
      </ActionIcon>
    </Tooltip>
  );
}

function CreateBannerButton({ refetch }: { refetch: Refetch }) {
  const [isLoading, loading] = useLoading();
  const handler = useCallback<MouseEventHandler>(() => {
    loading(async () => {
      const { data, errors } = await graphAuth(
        graphql(`
          mutation CmsBannerCreate($text: String!) {
            cmsBannerCreate(text: $text) {
              id
            }
          }
        `),
        { text: '' },
      );
      if (errors || !data?.cmsBannerCreate) {
        notifications.show({ color: 'red', message: errors?.[0]?.code });
        return;
      }
      await refetch();
    });
  }, [loading, refetch]);

  return (
    <Tooltip label="New alert">
      <ActionIcon
        onClick={handler}
        aria-label="New alert"
        color="slate"
        variant="light"
        loading={isLoading}
      >
        <IconPlus />
      </ActionIcon>
    </Tooltip>
  );
}

type Refetch = () => Promise<void>;
