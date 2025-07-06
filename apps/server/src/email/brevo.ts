import { Resource } from 'sst';
import { BrevoSender, BrevoSenders } from './senders';

export async function sendRawEmail(props: {
  to: string | string[];
  from?: BrevoSender;
  subject: string;
  html: string;
  text: string;
}) {
  const { to, from, subject, html, text } = props;

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',

    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': Resource.SecretBrevoAPIKey.value,
    },
    body: JSON.stringify({
      sender: from ?? BrevoSenders['__DEFAULT'],
      to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
      htmlContent: html,
      textContent: text,
      subject: subject,
    }),
  });
}
