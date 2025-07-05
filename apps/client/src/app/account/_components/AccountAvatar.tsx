import { useCallback } from 'react';

import { IconEdit } from '@tabler/icons-react';

import { useUser } from '@/app/_ctx/user/context';
import { confirmModal } from '@/app/_components/_base/modals';

import A from '@/app/_components/_base/A';

const GRAVATAR_EDIT_URL = 'https://gravatar.com/profile';

export default function AccountAvatar() {
  const user = useUser();

  const handleClick = useCallback(async () => {
    await confirmModal({
      title: <>Changing your profile picture</>,
      body: (
        <>
          <p>
            Profile pictures are taken from{' '}
            <A
              href="https://gravatar.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gravatar
            </A>
            . You can update your profile picture on their site.
          </p>
          <p>
            Be mindful that{' '}
            <b>Gravatar profile pictures are not just for Elm Point</b>; they
            can be seen by any website that uses the service (e.g. Slack,
            Wordpress, etc.)
          </p>
          <p>
            When prompted, enter the same email you use for your Elm Point
            account into Gravatar, and upload a profile picture under “Avatars”.
            It should show up here in a few minutes (you’ll need to reload the
            page.)
          </p>
        </>
      ),
      buttons: { confirm: 'Edit on Gravatar.com →' },
      confirmProps: {
        component: 'a',
        href: GRAVATAR_EDIT_URL,
        target: '_blank',
        rel: 'noopener noreferrer',
      } as any,
    });
  }, []);

  return (
    <>
      <a
        href={GRAVATAR_EDIT_URL}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative -m-2 rounded-full border border-slate-500 border-opacity-0 p-2 text-slate-500 hover:border-opacity-100"
      >
        <div
          className="size-36 rounded-full bg-slate-300 bg-cover bg-center"
          style={{ backgroundImage: `url(${user?.avatarUrl})` }}
        />
        <IconEdit className="invisible absolute right-0 top-0 size-6 p-1 group-hover:visible" />
      </a>
    </>
  );
}
