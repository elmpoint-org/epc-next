import { Resource } from 'sst';

const sender = {
  name: 'Elm Point',
  email: 'noreply@elmpoint.xyz',
};

export async function sendRawEmail(props: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
  const { to, subject, html, text } = props;

  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',

    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': Resource.SecretBrevoAPIKey.value,
    },
    body: JSON.stringify({
      sender: sender,
      to: Array.isArray(to) ? to.map((email) => ({ email })) : [{ email: to }],
      htmlContent: html,
      textContent: text,
      subject: subject,
    }),
  });
}
