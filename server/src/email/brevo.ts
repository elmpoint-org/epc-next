import {
  SendSmtpEmail,
  SendSmtpEmailSender,
  TransactionalEmailsApi,
} from '@getbrevo/brevo';

const { BREVO_API_KEY } = process.env;

let brevo = new TransactionalEmailsApi();
brevo.setApiKey(0, BREVO_API_KEY as string);

const sender: SendSmtpEmailSender = {
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

  const email = new SendSmtpEmail();
  email.sender = sender;
  email.to = Array.isArray(to)
    ? to.map((email) => ({ email }))
    : [{ email: to }];
  email.subject = subject;
  email.htmlContent = html;
  email.textContent = text;

  await brevo.sendTransacEmail(email);
}
