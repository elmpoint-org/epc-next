import { useUser } from '@/app/_ctx/user/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useLoginRedirect(redirectTo?: string, defaultValue?: string) {
  // once login trickles down, redirect to desired location
  const user = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user) router.push(redirectTo ?? defaultValue ?? '/');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
}
