'use client';

import { useUser } from '@/app/_ctx/user/context';
import { DeepNavLinks } from './navTypes';
import { Inside } from '@/util/inferTypes';
import { scopeCheck } from '@/util/scopeCheck';

export function useNavLinkScopeCheck(item: Inside<DeepNavLinks>) {
  const user = useUser();

  // if no requirements, return true
  if (!item.scope) return true;

  // just check for login
  if (!Array.isArray(item.scope)) return !!user;

  // check scope
  item.scope.push('ADMIN');
  return user && scopeCheck(user?.scope, ...item.scope);
}
