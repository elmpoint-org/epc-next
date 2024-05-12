import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import Providers, { ProvidersHead } from './_components/Providers';
import Shell from './_components/Shell';

import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <head>
          <ProvidersHead />
        </head>
        <body className={`${defaultFont.variable} bg-dwhite font-sans`}>
          <Providers>
            <Shell>
              {/*  */}
              {children}
            </Shell>
          </Providers>
        </body>
      </html>
    </>
  );
}
