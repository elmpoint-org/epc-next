import {
  SendSmtpEmail,
  SendSmtpEmailSender,
  TransactionalEmailsApi,
} from '@getbrevo/brevo';
import { Senders } from './senders';

const { BREVO_API_KEY } = process.env;

let brevo = new TransactionalEmailsApi();
brevo.setApiKey(0, BREVO_API_KEY as string);

const sender: SendSmtpEmailSender = {
  name: 'Elm Point',
  email: Senders.DEFAULT,
};

export async function sendRawEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
}) {
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
