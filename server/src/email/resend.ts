import { CreateEmailOptions, Resend } from 'resend';
import { render } from '@react-email/components';

import { Senders } from './senders';
import { isDev } from '@@/util/dev';
import { brevo } from '.';
import { el } from './components/getElement';

const resend = new Resend(process.env.RESEND_API_KEY ?? 'DEVELOPMENT');

export async function send(
  { ...props }: { from: Senders } & CreateEmailOptions,
  options?: { fallback?: boolean }
) {
  if (isDev) return localSend(props.react, props.subject);

  const { error } = await resend.emails.send({
    ...props,
    text: props.text ?? (await render(el(props.react), { plainText: true })),
  });
  if (error) {
    if (error.name.includes('invalid') || error.name.includes('missing'))
      return false;

    // run fallback if requested
    if (!options?.fallback) return false;
    return brevoFallback(props.to, props.subject, props.react);
  }
  return true;
}

function localSend(content: React.ReactNode, title?: string) {
  return catchTF(async () => {
    const text = await render(el(content), { plainText: true });
    console.log(`${title || 'EMAIL CONTENTS'}\n`, text);
  });
}

function brevoFallback(
  to: string | string[],
  subject: string,
  content: React.ReactNode
) {
  return catchTF(async () => {
    const html = await render(el(content));
    const text = await render(el(content), { plainText: true });

    await brevo.sendRawEmail({ to, subject, html, text });
  });
}

// --------------------------------------

async function catchTF(cb: (...p: any[]) => any): Promise<boolean> {
  try {
    const out = await cb();
    return out ?? true;
  } catch (_) {
    return false;
  }
}
