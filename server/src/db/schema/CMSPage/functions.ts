import type { CmsPageModule as M } from './__types/module-types';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '@@/db/lib/utilities';
import { DBType } from '@@/db/lib/Model';
import { DBCmsPage } from './source';

import { ResolverContext } from '@@/db/graph';
const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getCmsPages = h<M.QueryResolvers['cmsPages']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, userId }) => {
    if (!userId) throw scopeError();
    return sources.cms.page.getAll();
  }
);

export const getCmsPage = h<M.QueryResolvers['cmsPage']>(
  async ({ sources, args: { id } }) => {
    return sources.cms.page.get(id);
  }
);

export const getCmsPageFromSlug = h<M.QueryResolvers['cmsPageFromSlug']>(
  async ({ sources, args: { slug } }) => {
    const q = await sources.cms.page.findBy('slug', slug);
    const p = q?.[0] ?? null;
    if (p && !p.publish) throw err('NOT_PUBLISHED');

    return p;
  }
);

export const cmsPageCreate = h<M.MutationResolvers['cmsPageCreate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { contributorAdd, ...pageParams } }) => {
    const page = pageParams as DBCmsPage;

    // check for used slug
    if (page.slug) {
      if (page.slug.length === 0) throw err('EMPTY_SLUG');
      const s = await sources.cms.page.findBy('slug', page.slug);
      if (s?.length) throw err('SLUG_IN_USE');
    }

    // handle contributors
    if (contributorAdd) {
      const u = await sources.user.get(contributorAdd);
      if (!u) throw err('INVALID_CONTRIBUTOR');
      page.contributorIds = [contributorAdd];
    } else {
      page.contributorIds = [];
    }
    return sources.cms.page.create(page);
  }
);

export const cmsPageUpdate = h<M.MutationResolvers['cmsPageUpdate']>(
  scoped('ADMIN', 'EDIT'),
  async ({
    sources,
    args: { id, contributorAdd, contributorRemove, ...pageParams },
  }) => {
    const updates = pageParams as DBCmsPage;

    // find page
    const p = await sources.cms.page.get(id);
    if (!p) throw err('PAGE_NOT_FOUND');

    // check for used slug
    if (typeof updates.slug === 'string' && updates.slug !== p.slug) {
      if (updates.slug.length === 0) throw err('EMPTY_SLUG');
      const s = await sources.cms.page.findBy('slug', updates.slug);
      if (s?.length) throw err('SLUG_IN_USE');
    }

    // handle contributors
    if (contributorAdd && !p.contributorIds.includes(contributorAdd)) {
      const u = await sources.user.get(contributorAdd);
      if (!u) throw err('INVALID_CONTRIBUTOR');
      updates.contributorIds = [...p.contributorIds, contributorAdd];
    }
    if (contributorRemove) {
      updates.contributorIds = p.contributorIds.filter(
        (it) => it !== contributorRemove
      );
    }

    return sources.cms.page.update(id, updates);
  }
);

export const cmsPageDelete = h<M.MutationResolvers['cmsPageDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id }, userId, scope }) => {
    const p = await sources.cms.page.get(id);
    if (!p) throw err('PAGE_NOT_FOUND');

    if (!(p.contributorIds.includes(userId ?? '') || scopeDiff(scope, 'ADMIN')))
      throw scopeError();

    return sources.cms.page.delete(id);
  }
);

export const getCmsPageContent = h<M.CMSPageResolvers['content']>(
  async ({ parent: { secure, content }, userId }) => {
    if (secure && !userId) throw scopeError();
    return content!;
  }
);

export const getCmsPageContributors = h<M.CMSPageResolvers['contributors']>(
  async ({ sources, parent }) => {
    const { contributorIds } = parent as DBType<DBCmsPage>;

    if (!contributorIds?.length) return [];

    // get users by their IDs
    const u = (await sources.user.getMultiple(contributorIds)).filter(
      (c) => !!c
    );

    return u;
  }
);
