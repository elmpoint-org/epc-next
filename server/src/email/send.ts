import {
  SendSmtpEmail,
  SendSmtpEmailSender,
  TransactionalEmailsApi,
} from '@getbrevo/brevo';
import qs from 'qs';
import { siteDomain } from '@@/util/dev';

const { BREVO_API_KEY } = process.env;

let brevo = new TransactionalEmailsApi();
brevo.setApiKey(0, BREVO_API_KEY as string);

const sender: SendSmtpEmailSender = {
  name: 'Elm Point',
  email: 'no-reply@elmpoint.xyz',
};

export async function sendRegistrationEmail(token: string) {
  const email = new SendSmtpEmail();
  email.sender = sender;
  email.to = [{ email: 'newuser@foster.audio' }];
  email.templateId = 1;
  email.params = {
    URL: `${siteDomain}/auth/activate?${qs.stringify({ token })}`,
  };

  await brevo.sendTransacEmail(email);
}
