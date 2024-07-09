import { IconLock } from '@tabler/icons-react';

import { homeLinks } from '@/sample-data/homeLinksData';

import A from './_components/_base/A';
import LogoPanel from './_components/_base/LogoPanel';
import LinkBlock from './_components/home/LinkBlock';

export default async function HomePage() {
  const links = homeLinks; // TODO should be db

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2">
        {/* logo panel */}
        <h1 className="mb-6 flex flex-col items-center justify-center text-4xl">
          <LogoPanel />
        </h1>

        {/* page content */}
        <div className="container flex-1 rounded-lg bg-slate-100">
          <div className="mx-auto flex max-w-screen-lg flex-col gap-4 p-2 sm:p-6">
            {/* title block */}
            <div className="flex flex-col items-stretch gap-2.5 p-2.5">
              <h1 className="text-center text-2xl">
                Welcome to the new Elm Point website!
              </h1>
              <div className="mx-auto p-2.5">
                See below for links to commonly used pages on this website.
                Items with{' '}
                <IconLock
                  className="mx-0.5 -mt-1 inline size-5 text-slate-600"
                  stroke={1.5}
                />
                locks will require you to{' '}
                <A
                  href="/auth/login"
                  className="-my-0.5 rounded-md bg-dgreen/5 px-1.5 py-0.5 hover:bg-dgreen/10"
                >
                  log in
                </A>{' '}
                to see them.
              </div>
            </div>

            {/* links section */}
            <div className="grid auto-rows-fr grid-cols-1 gap-2.5 p-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {links
                .sort((a, b) => a.order - b.order)
                .map((props, i) => (
                  <LinkBlock key={i} {...props} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
