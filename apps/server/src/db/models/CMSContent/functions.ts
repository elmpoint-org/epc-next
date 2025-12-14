import { ResolverContext } from '##/db/graph.js';
import {
  err,
  getTypedScopeFunctions,
  handle as h,
} from '##/db/lib/utilities.js';
import { D1, unixNow } from '@epc/date-ts';
import { CmsContentModule as M } from './__types/module-types';
import { DBCMSBanner } from './source';

const { scopeDiff, scoped } = getTypedScopeFunctions<ResolverContext>();

export const getCmsBanners = h<M.QueryResolvers['cmsBanners']>(
  async ({ sources }) => {
    return sources.cms.content.banner.getAll();
  }
);

export const getCmsBannersNow = h<M.QueryResolvers['cmsBannersNow']>(
  async ({ sources }) => {
    const banners = await sources.cms.content.banner.getAll();
    return banners.filter((b) => {
      const now = unixNow();
      if (typeof b.date_start === 'number' && now < b.date_start) return false;
      if (typeof b.date_end === 'number' && now > b.date_end + D1) return false;
      return true;
    });
  }
);

export const cmsBannerCreate = h<M.MutationResolvers['cmsBannerCreate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: item, userId }) => {
    return sources.cms.content.banner.create({ ...item, authorId: userId! });
  }
);

export const cmsBannerUpdate = h<M.MutationResolvers['cmsBannerUpdate']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id, ...updates } }) => {
    const item = await sources.cms.content.banner.get(id);
    if (!item) throw err('NOT_FOUND');

    return sources.cms.content.banner.update(id, updates);
  }
);

export const cmsBannerDelete = h<M.MutationResolvers['cmsBannerDelete']>(
  scoped('ADMIN', 'EDIT'),
  async ({ sources, args: { id } }) => {
    return sources.cms.content.banner.delete(id);
  }
);

export const cmsBannerDeleteMultiple = h<
  M.MutationResolvers['cmsBannerDeleteMultiple']
>(scoped('ADMIN', 'EDIT'), async ({ sources, args: { ids } }) => {
  return (
    (await sources.cms.content.banner.deleteMultiple(ids))?.map(
      (it) => it ?? null
    ) ?? []
  );
});

export const getCmsBannerAuthor = h<M.CMSBannerResolvers['author']>(
  async ({ sources, parent }) => {
    const { authorId } = parent as DBCMSBanner;
    return sources.user.get(authorId);
  }
);
