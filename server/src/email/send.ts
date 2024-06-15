import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const ses = new SESv2Client();

export async function sendTestEmail() {
  await ses.send(
    new SendEmailCommand({
      FromEmailAddress: 'no-reply@elmpoint.xyz',
      Destination: {
        ToAddresses: ['firsttest@foster.audio'],
      },
      Content: {
        Simple: {
          Subject: { Data: 'This is my email' },
          Body: {
            Text: { Data: '<h3>Hello world</h3>' },
            Html: { Data: 'Hello world' },
          },
        },
      },
    })
  );
}
