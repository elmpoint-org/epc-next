import type { Metadata } from 'next';
import { Atkinson_Hyperlegible, IBM_Plex_Sans } from 'next/font/google';

import Providers, { HeadProviders } from './_components/Providers';
import Shell from './_components/Shell';

import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

// const defaultFont = Atkinson_Hyperlegible({
//   subsets: ['latin'],
//   weight: ['400', '700'],
//   display: 'swap',
//   variable: '--font-default',
// });
const defaultFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '700',],
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
          <HeadProviders />
        </head>
        <body className={`${defaultFont.variable} bg-dwhite font-sans`}>
          <Providers>
            {/* <div className="h-12 w-full bg-red-700"></div>
            <div className="flex min-h-dvh flex-col"></div> */}
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
