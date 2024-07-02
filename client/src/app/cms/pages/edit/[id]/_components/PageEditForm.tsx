'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import fdeq from 'fast-deep-equal';
import type { ResultOf } from '@graphql-typed-document-node/core';

import { notifications } from '@mantine/notifications';
import { getHotkeyHandler } from '@mantine/hooks';

import { graphAuth, graphError, graphql } from '@/query/graphql';
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

  // save flow
  const [isSaving, saving] = useTransition();
  const saveState = useMemo<SaveState>(() => {
    if (isSaving) return 'SAVING';
    if (fdeq(form, initForm(serverPage, user?.id))) return 'SAVED';
    return 'UNSAVED';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSaving, form, serverPage]);
  function save() {
    saving(async () => {
      const cc = form.shouldAddContributor;
      const f = await graphAuth(UPDATE_CMS_PAGE, {
        id,
        ...form,
        contributorAdd: (cc && user?.id) || null,
        contributorRemove: (!cc && user?.id) || null,
      }).catch((err) => {
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
    const cb = (e: BeforeUnloadEvent) => {
      if (saveState === 'SAVED') return;
      e.preventDefault();
    };
    window.addEventListener('beforeunload', cb);
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

        <DeletePage pageId={id} />
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
};
