import { AuthUser } from '@/app/_ctx/user/provider';

export function scopeCheck(
  scope: AuthUser['scope'],
  ...required: AuthUser['scope'] & {}
) {
  return required.length > required.filter((s) => !scope?.includes(s)).length;
}
