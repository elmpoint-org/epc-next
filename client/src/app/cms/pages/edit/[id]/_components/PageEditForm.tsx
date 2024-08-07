'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import fdeq from 'fast-deep-equal';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { notifications } from '@mantine/notifications';
import { getHotkeyHandler } from '@mantine/hooks';

import { graphql, graphAuth } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import { useUser } from '@/app/_ctx/user/context';
import { revalidatePage } from '../../../_actions/edit';
import { cmsErrorMap } from '../../../../_util/cmsErrors';

import { SkeletonProvider } from '@/app/_ctx/skeleton/context';
import TextFields from './TextFields';
import PageOptions from './PageOptions';
import TextEditor from '../../../_components/Editor';
import ViewPageLink from '../../../_components/ViewPageLink';
import SaveRow, { SaveState } from './SaveRow';
import DeletePage from './DeletePage';

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
const UPDATE_CMS_PAGE = graphql(`
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
    if (serverPage) updateForm(initForm(serverPage, user?.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverPage]);

  // save state
  const [isSaving, saving] = useTransition();
  const [isTyping, setIsTyping] = useState(false);
  const saveState = useMemo<SaveState>(() => {
    if (isTyping) return 'TYPING';
    if (isSaving) return 'SAVING';
    if (fdeq(form, initForm(serverPage, user?.id))) return 'SAVED';
    return 'UNSAVED';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTyping, isSaving, form, serverPage]);

  // handle save
  function save() {
    if (saveState === 'TYPING') return;
    saving(async () => {
      const cc = form.shouldAddContributor;
      const { data, errors } = await graphAuth(UPDATE_CMS_PAGE, {
        id,
        ...form,
        contributorAdd: (cc && user?.id) || null,
        contributorRemove: (!cc && user?.id) || null,
      });
      if (errors || !data?.cmsPageUpdate) {
        notifications.show({
          color: 'red',
          message: `Error: ${cmsErrorMap(errors?.[0].code)}`,
        });
        return;
      }

      pageQuery.refetch();
      if (form.slug.length) revalidatePage(form.slug);
    });
  }

  // warn before closing
  useEffect(() => {
    const cb = (e: BeforeUnloadEvent) => {
      if (saveState === 'SAVED') return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', cb);
    return () => window.removeEventListener('beforeunload', cb);
  }, [saveState]);

  const formProps: EditFormProps = { form, updateForm, serverPage, pageId: id };
  return (
    <>
      <SkeletonProvider ready={!pageQuery.isPending}>
        <div
          className="flex flex-col gap-4"
          tabIndex={0}
          onKeyDown={getHotkeyHandler([['mod+shift+Enter', save]])}
        >
          <div className="flex flex-row items-center justify-between">
            <ViewPageLink {...formProps} />
            <SaveRow onClick={save} state={saveState} />
          </div>

          {/* text fields */}
          <TextFields {...formProps} />

          {/* options */}
          <PageOptions {...formProps} />

          {/* page content */}
          <TextEditor {...formProps} onTyping={setIsTyping} />

          <div className="flex flex-row justify-end">
            <SaveRow onClick={save} state={saveState} />
          </div>
        </div>

        <DeletePage {...formProps} />
      </SkeletonProvider>
    </>
  );
}

function initForm(
  r: ResultOf<typeof GET_CMS_PAGE>['cmsPage'],
  userId?: string,
) {
  return {
    title: r?.title ?? '',
    slug: r?.slug ?? '',
    content: r?.content ?? '',
    secure: r?.secure ?? true,
    publish: r?.publish ?? false,
    shouldAddContributor:
      r && userId ? r.contributors.some((it) => it?.id === userId) : true,
  };
}
export type EditForm = ReturnType<typeof initForm>;
export type EditFormProps = {
  form: EditForm;
  updateForm: (d: Partial<EditForm>) => void;
  serverPage: ResultOf<typeof GET_CMS_PAGE>['cmsPage'];
  pageId: string;
};
