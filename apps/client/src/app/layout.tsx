import Script from 'next/script';
import { IBM_Plex_Sans } from 'next/font/google';
import type { Metadata } from 'next';

import type { Children } from '@/util/propTypes';
import Providers, { ProvidersHead } from './_components/Providers';
import Shell from './_components/Shell';
import { UserProvider } from './_ctx/user/provider';

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import './globals.css';

const defaultFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-default',
});

export const metadata: Metadata = {
  title: {
    template: '%s - Elm Point',
    default: 'Elm Point',
  },
};

export default function RootLayout({ children }: Children) {
  return (
    <>
      <html lang="en" data-mantine-color-scheme="light">
        <head>
          <ProvidersHead />
        </head>
        <body
          className={`${defaultFont.variable} bg-slate-200 font-sans text-dblack`}
        >
          <UserProvider>
            <Providers>
              <Shell>
                {/*  */}
                {children}
              </Shell>
            </Providers>
          </UserProvider>
          <Script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "a1798abad46f44ee8aa247fc966e78a7"}'
          />
        </body>
      </html>
    </>
  );
}
