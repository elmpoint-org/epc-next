'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import fdeq from 'fast-deep-equal';

import { graphAuth, graphError, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import TextEditor from './Editor';
import SaveRow, { SaveState } from './SaveRow';
import TextFields from './TextFields';
import PageOptions from './PageOptions';
import { useUser } from '@/app/_ctx/user/context';
import { notifications } from '@mantine/notifications';
import { getHotkeyHandler } from '@mantine/hooks';
import { revalidatePage } from '../_actions/edit';
import { cmsErrorMap } from '../../_util/cmsErrors';
import ViewPageLink from './ViewPageLink';

export const GET_CMS_PAGE = graphql(`
  query CmsPage($id: ID!) {
    cmsPage(id: $id) {
      id
      slug
      title
      content
      secure
      publish
      contributors {
        id
      }
      timestamp {
        created
        updated
      }
    }
  }
`);

// COMPONENT
export default function PageEditForm({ id }: { id: string }) {
  const user = useUser();

  // fetch db entry
  const pageQuery = useGraphQuery(GET_CMS_PAGE, { id });
  const serverPage = useMemo(
    () => pageQuery.data?.cmsPage ?? null,
    [pageQuery.data],
  );

  // form state
  const [form, setForm] = useState(initForm(serverPage));
  function updateForm(u: Partial<typeof form>) {
    setForm((o) => ({ ...o, ...u }));
  }
  // update on load
  useEffect(() => {
    if (serverPage) updateForm(initForm(serverPage, form.shouldAddContributor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPage]);

  // save flow
  const [isSaving, saving] = useTransition();
  const saveState = useMemo<SaveState>(() => {
    if (isSaving) return 'SAVING';
    if (fdeq(form, initForm(serverPage, form.shouldAddContributor)))
      return 'SAVED';
    return 'UNSAVED';
  }, [isSaving, form, serverPage]);
  function save() {
    saving(async () => {
      const cc = form.shouldAddContributor;
      const f = await graphAuth(
        graphql(`
          mutation CmsPageUpdate(
            $id: ID!
            $slug: String
            $title: String
            $content: String
            $secure: Boolean
            $publish: Boolean
            $contributorAdd: String
            $contributorRemove: String
          ) {
            cmsPageUpdate(
              id: $id
              slug: $slug
              title: $title
              content: $content
              secure: $secure
              publish: $publish
              contributorAdd: $contributorAdd
              contributorRemove: $contributorRemove
            ) {
              id
            }
          }
        `),
        {
          id,
          ...form,
          contributorAdd: (cc && user?.id) || null,
          contributorRemove: (!cc && user?.id) || null,
        },
      ).catch((err) => {
        console.log(err);
        notifications.show({
          color: 'red',
          message: `Error: ${cmsErrorMap(graphError(err?.response?.errors))}`,
        });
        return false;
      });
      if (!f) return;

      pageQuery.refetch();
      if (form.slug.length) revalidatePage(form.slug);
    });
  }

  // warn before closing
  useEffect(() => {
    const cb = (e: Event) => e.preventDefault();
    if (saveState !== 'SAVED') window.addEventListener('beforeunload', cb);
    return () => window.removeEventListener('beforeunload', cb);
  }, [saveState]);

  const formProps: EditFormProps = { form, updateForm, serverPage };
  return (
    <>
      <SkeletonProvider ready={!pageQuery.isPending}>
        <div
          className="flex flex-col gap-4"
          tabIndex={0}
          onKeyDown={getHotkeyHandler([['mod+shift+Enter', save]])}
        >
          <SaveRow onClick={save} state={saveState} />

          {/* text fields */}
          <TextFields {...formProps} />

          {/* options */}
          <PageOptions {...formProps} />

          {/* page content */}
          <TextEditor {...formProps} />

          {/* page link */}
          <ViewPageLink {...formProps} />

          <SaveRow onClick={save} state={saveState} />
        </div>
      </SkeletonProvider>
    </>
  );
}

function initForm(
  r: ResultOf<typeof GET_CMS_PAGE>['cmsPage'],
  shouldAdd?: boolean,
) {
  return {
    title: r?.title ?? '',
    slug: r?.slug ?? '',
    content: r?.content ?? '',
    secure: r?.secure ?? true,
    publish: r?.publish ?? false,
    shouldAddContributor: shouldAdd ?? true,
  };
}
export type EditForm = ReturnType<typeof initForm>;
export type EditFormProps = {
  form: EditForm;
  updateForm: (d: Partial<EditForm>) => void;
  serverPage: ResultOf<typeof GET_CMS_PAGE>['cmsPage'];
};
