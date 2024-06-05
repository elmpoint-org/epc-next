import Script from 'next/script';
import { IBM_Plex_Sans } from 'next/font/google';
import type { Metadata } from 'next';

import Providers, { ProvidersHead } from './_components/Providers';
import Shell from './_components/Shell';

import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Children } from '@/util/childrenType';

const defaultFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-default',
});

export const metadata: Metadata = {
  title: {
    template: '%s - elm point',
    default: 'elm point',
  },
};

export default function RootLayout({ children }: Children) {
  return (
    <>
      <html lang="en">
        <head>
          <ProvidersHead />
        </head>
        <body className={`${defaultFont.variable} bg-slate-200 font-sans`}>
          <Providers>
            <Shell>
              {/*  */}
              {children}
            </Shell>
          </Providers>
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
