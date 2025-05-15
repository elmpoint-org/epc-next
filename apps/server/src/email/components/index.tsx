import React, { forwardRef, ReactNode } from 'react';

import {
  Body,
  Button as Button0,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link as Link0,
  Section,
  Tailwind,
} from '@react-email/components';

type Children = { children?: ReactNode };
type ClassNames = { className?: string };
export const clx = (...s: (string | unknown)[]) =>
  s.filter((it) => typeof it === 'string').join(' ');

// ------------------------------------------------------

type WrapperProps = { footer?: ReactNode } & Children;
export const Wrapper = forwardRef<HTMLHtmlElement, WrapperProps>(
  ({ children, footer }, ref) => (
    <Html ref={ref}>
      <Tailwind
        config={{
          theme: {
            fontSize: {
              xs: ['12px', { lineHeight: '16px' }],
              sm: ['14px', { lineHeight: '20px' }],
              base: ['16px', { lineHeight: '24px' }],
              lg: ['18px', { lineHeight: '28px' }],
              xl: ['20px', { lineHeight: '28px' }],
              '2xl': ['24px', { lineHeight: '32px' }],
              '3xl': ['30px', { lineHeight: '36px' }],
              '4xl': ['36px', { lineHeight: '36px' }],
              '5xl': ['48px', { lineHeight: '1' }],
              '6xl': ['60px', { lineHeight: '1' }],
              '7xl': ['72px', { lineHeight: '1' }],
              '8xl': ['96px', { lineHeight: '1' }],
              '9xl': ['144px', { lineHeight: '1' }],
            },
            spacing: {
              px: '1px',
              0: '0',
              0.5: '2px',
              1: '4px',
              1.5: '6px',
              2: '8px',
              2.5: '10px',
              3: '12px',
              3.5: '14px',
              4: '16px',
              5: '20px',
              6: '24px',
              7: '28px',
              8: '32px',
              9: '36px',
              10: '40px',
              11: '44px',
              12: '48px',
              14: '56px',
              16: '64px',
              20: '80px',
              24: '96px',
              28: '112px',
              32: '128px',
              36: '144px',
              40: '160px',
              44: '176px',
              48: '192px',
              52: '208px',
              56: '224px',
              60: '240px',
              64: '256px',
              72: '288px',
              80: '320px',
              96: '384px',
            },
          },
        }}
      >
        <Head />
        <Body className="font-sans px-2 sm:pt-6 bg-slate-50 overflow-x-hidden">
          <Container className="mx-auto w-full max-w-[384px]">
            <div className="relative space-y-4 border border-solid border-slate-300 shadow-sm p-6 rounded-xl">
              {/* logo */}
              <Section className="p-4 bg-emerald-900 text-slate-100 rounded-lg text-3xl text-center font-serif tracking-wider">
                ELM POINT
              </Section>

              <Hr className="!border-slate-300 mt-4" />

              {children}
            </div>
          </Container>
          {footer}
        </Body>
      </Tailwind>
    </Html>
  )
);

export const Prose = forwardRef<HTMLDivElement, Children & ClassNames>(
  ({ children, className }, ref) => (
    <div ref={ref} className={clx('px-2.5 mb-2 text-sm', className)}>
      {children}
      {/*  */}
    </div>
  )
);

export const Footer = forwardRef<HTMLDivElement, Children & ClassNames>(
  ({ children, className }, ref) => (
    <div
      ref={ref}
      className={clx(
        'text-sm max-w-screen-lg mx-auto break-all text-center p-4 text-slate-600',
        className
      )}
    >
      {children}
    </div>
  )
);

export const Title = forwardRef<HTMLHeadingElement, Children & ClassNames>(
  ({ children, className }, ref) => (
    <Heading ref={ref} className={clx('text-center text-xl py-2', className)}>
      {children}
      {/*  */}
    </Heading>
  )
);

export const HR = forwardRef<HTMLHRElement, ClassNames>(
  ({ className }, ref) => (
    <>
      <Hr ref={ref} className={clx('!border-slate-300', className)} />
    </>
  )
);

export const Button = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Button0>
>(({ children, className, ...props }, ref) => (
  <Button0
    ref={ref}
    className={clx(
      'box-border bg-emerald-700 text-slate-100 w-full p-2 rounded-md text-center text-sm font-bold',
      className
    )}
    {...props}
  >
    {children}
  </Button0>
));

export const Link = forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link0>
>(({ className, ...props }, ref) => (
  <Link0 ref={ref} className={clx('text-emerald-700', className)} {...props} />
));
