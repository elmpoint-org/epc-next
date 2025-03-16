import { alphabetical } from '@/util/sort';
import { MemberUser } from '../_component/TrustedWrapper';

export function prepMemberList(list: Maybe<Maybe<MemberUser>[]>) {
  return (
    list
      ?.filter((it): it is MemberUser => it !== null)
      .sort(alphabetical((it) => it?.name ?? '')) ?? []
  );
}

type Maybe<T> = T | null | undefined;
