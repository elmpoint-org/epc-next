'use client';

import { useCallback, useMemo } from 'react';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useWindowSize } from '@uidotdev/usehooks';

import type { Children } from '@/util/propTypes';
import { breakpoints } from '@/util/tailwindVars';
import { clmx } from '@/util/classConcat';

import Navbar from './Navbar';
import NavControl from './nav/NavControl';

const NAV_WIDTH = 300;

const Shell = ({ children }: Children) => {
  // breakpoint vars
  const { width: winWidth } = useWindowSize();
  const isDesktop = useMemo(
    () => winWidth !== null && winWidth >= breakpoints('lg'),
    [winWidth],
  );

  // nav state

  const navState = useDisclosure();
  const [isOpenMobile, openMobile] = navState;
  const navDesktopState = useDisclosure(true);
  const [isOpenDesktop, openDesktop] = navDesktopState;

  const changeOpenState = useCallback(
    (isOpen?: boolean) => {
      const obj = !isDesktop ? openMobile : openDesktop;

      if (typeof isOpen === 'undefined') {
        obj.toggle();
        return;
      }
      if (isOpen) obj.open();
      else obj.close();
    },
    [isDesktop, openDesktop, openMobile],
  );

  // RENDER
  return (
    <>
      <AppShell
        navbar={{
          width: NAV_WIDTH,
          breakpoint: 'md',
          collapsed: { mobile: !isOpenMobile, desktop: !isOpenDesktop },
        }}
        padding="md"
      >
        <Navbar isOpen={isOpenMobile} onClose={openMobile.close} />
        <NavControl
          isDesktop={isDesktop}
          isOpen={isOpenDesktop}
          onClick={() => changeOpenState(!isDesktop || undefined)}
          style={{ left: (isDesktop && isOpenDesktop && NAV_WIDTH) || 0 }}
          className={clmx(
            isOpenDesktop && 'lg:invisible',
            isDesktop &&
              isOpenDesktop &&
              'bg-transparent opacity-50 hover:visible hover:bg-slate-100 hover:opacity-100 focus:visible focus:opacity-100 peer-hover:visible',
          )}
        />

        <AppShell.Main
          className="flex flex-col bg-slate-200 p-4 pt-12 max-lg:!ml-0 data-[cd]:lg:!ml-0"
          style={{ marginLeft: NAV_WIDTH }}
          data-cd={!isOpenDesktop || null}
        >
          <div className="container mx-auto flex flex-1 flex-col has-[.page-full-width]:mx-0 has-[.page-full-width]:max-w-[initial] print:!max-w-none">
            {children}
          </div>
        </AppShell.Main>
      </AppShell>
    </>
  );
};
export default Shell;
