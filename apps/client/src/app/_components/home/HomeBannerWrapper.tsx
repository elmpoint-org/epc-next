import { graphAuthServer } from '@/query/graphql.server';
import HomeBanner from './HomeBanner';
import { HOME_BANNERS_NOW_QUERY } from './homeBanners';
import Link from 'next/link';
import { getUser } from '@/app/_ctx/user/provider';
import { scopeCheck } from '@/util/scopeCheck';

export async function HomeBannerList() {
  const { data, errors } = await graphAuthServer(HOME_BANNERS_NOW_QUERY);
  if (errors || !data?.cmsBannersNow) return null;
  const items = data.cmsBannersNow.filter((c) => !!c.text.length);

  return (
    <div className="relative mx-2 -mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <HomeBanner key={item.id} {...item} />
      ))}

      <BannerEditButton />
    </div>
  );
}

async function BannerEditButton() {
  const user = await getUser();
  if (!user || !scopeCheck(user.scope, 'ADMIN', 'EDIT')) return null;

  return (
    <Link
      href="/cms/banners"
      className="absolute bottom-[-1.125rem] right-0.5 text-xs italic text-slate-500 hover:text-dblack hover:underline"
    >
      Edit Alerts &rarr;
    </Link>
  );
}
