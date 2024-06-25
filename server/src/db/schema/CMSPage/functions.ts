import {
  CmsPageResolvers,
  MutationResolvers,
  QueryResolvers,
} from '@@/db/__types/graphql-types';
import { ResolverContext } from '@@/db/graph';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
  scopeError,
} from '@@/db/lib/utilities';
import { DBCmsPage } from './source';
import { DBType } from '@@/db/lib/Model';

const { scoped, scopeDiff } = getTypedScopeFunctions<ResolverContext>();

export const getCmsPages = h<QueryResolvers['cmsPages']>(
  async ({ sources, userId }) => {
    if (!userId) throw scopeError();
    return sources.cms.page.getAll();
  }
);

export const getCmsPage = h<QueryResolvers['cmsPage']>(
  async ({ sources, args: { id }, userId }) => {
    if (!userId) throw scopeError();
    return sources.cms.page.get(id);
  }
);

export const getCmsPageFromSlug = h<QueryResolvers['cmsPageFromSlug']>(
  async ({ sources, args: { slug } }) => {
    const q = await sources.cms.page.findBy('slug', slug);
    return q?.[0] ?? null;
  }
);

export const cmsPageCreate = h<MutationResolvers['cmsPageCreate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { contributorAdd, ...pageParams } }) => {
    const page = pageParams as DBCmsPage;

    // check for used slug
    const s = await sources.cms.page.findBy('slug', page.slug);
    if (s.length) throw err('SLUG_IN_USE');

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

export const cmsPageUpdate = h<MutationResolvers['cmsPageUpdate']>(
  scoped('ADMIN', 'EDIT'),
  async ({
    sources,
    args: { id, contributorAdd, contributorRemove, ...pageParams },
  }) => {
    const updates = pageParams as DBCmsPage;

    // find page
    const p = await sources.cms.page.get(id);
    if (!p) throw err('PAGE_NOT_FOUND');

    // handle contributors
    if (contributorAdd) {
      const u = await sources.user.get(contributorAdd);
      if (!u) throw err('INVALID_CONTRIBUTOR');
      if (!p.contributorIds.includes(contributorAdd))
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

export const cmsPageDelete = h<MutationResolvers['cmsPageDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id }, userId, scope }) => {
    const p = await sources.cms.page.get(id);
    if (!p) throw err('PAGE_NOT_FOUND');

    if (!(p.contributorIds.includes(userId ?? '') || scopeDiff(scope, 'ADMIN')))
      throw scopeError();

    return sources.cms.page.delete(id);
  }
);

export const getCmsPageContributors = h<CmsPageResolvers['contributors']>(
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
