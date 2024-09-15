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
      <Tailwind>
        <Head />
        <Body className="font-sans px-2 sm:pt-6 bg-slate-200 overflow-x-hidden">
          <Container className="mx-auto w-full max-w-[384px]">
            <div className="relative space-y-4 border border-solid border-slate-300 bg-slate-100 p-6 rounded-xl">
              <Section>
                <Img
                  src="https://one.elmpoint.xyz/epc-email-logo.png"
                  width="334"
                  height="62"
                  alt="Elm Point"
                  className="my-0 mx-auto h-auto max-w-full"
                  draggable={false}
                />
              </Section>

              <Hr className="!border-slate-300 mt-4" />

              {children}
            </div>

            {footer}
          </Container>
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
      className={clx('text-sm text-center p-4 text-slate-600', className)}
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
      'box-border bg-emerald-700/95 text-slate-100 w-full p-2 rounded-md text-center text-sm font-bold',
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
