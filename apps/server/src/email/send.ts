import { CreateEmailOptions, Resend } from 'resend';
import { render } from '@react-email/components';

import { Senders } from './senders';
import { isDev } from '##/util/dev.js';
import { brevo } from '.';
import { el } from './components/getElement';
import { Resource } from 'sst';
import { catchTF } from '##/util/catchTF.js';
import { BrevoSender } from './senders';

const resend = new Resend(Resource.SecretResendAPIKey.value);

export async function send(
  { ...props }: { from: Senders; brevoFrom?: BrevoSender } & CreateEmailOptions,
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
    return brevoFallback({ ...props, content: props.react });
  }
  return true;
}

function localSend(content: React.ReactNode, title?: string) {
  return catchTF(async () => {
    const text = await render(el(content), { plainText: true });
    console.log(`${title || 'EMAIL CONTENTS'}\n`, text);
  });
}

export function sendWithBrevo(props: Parameters<typeof brevoFallback>[0]) {
  if (isDev) return localSend(props.content, props.subject);
  return brevoFallback(props);
}

function brevoFallback({
  to,
  brevoFrom: from,
  subject,
  content,
}: {
  to: string | string[];
  brevoFrom?: BrevoSender;
  subject: string;
  content: React.ReactNode;
}) {
  return catchTF(async () => {
    const html = await render(el(content));
    const text = await render(el(content), { plainText: true });

    await brevo.sendRawEmail({ to, from, subject, html, text });
  });
}
