import qs from 'qs';
import { Button, Footer, Link, Prose, Title, Wrapper } from '../components';
import { send } from '../send';
import { BrevoSenders, Senders } from '../senders';
import { siteDomain } from '##/util/dev.js';

/** verify a user's email address for registration. */
export async function emailRegistration(
  emailAddress: string,
  { token }: { token: string }
) {
  const url = `${siteDomain}/auth/activate?${qs.stringify({ token })}`;

  return send(
    {
      to: emailAddress,
      from: Senders.AUTH,
      brevoFrom: BrevoSenders.AUTH,
      subject: SUBJECT,
      react: Content({ url }),
    },
    { fallback: true }
  );
}

const SUBJECT = 'Verify your email address for your Elm Point account';
function Content({ url }: { url: string }) {
  return (
    <Wrapper
      children={
        <>
          <Prose>
            <Title>Finish creating your account</Title>
            <p>Thanks for joining the Elm Point website!</p>
            <p>
              Click the link below to confirm your email and finish creating
              your account.
            </p>
          </Prose>
          <Button href={url}>Click here to continue</Button>
        </>
      }
      footer={
        <Footer>
          <p>This is an automated message.</p>
          <p>
            Click this link if the button above didn’t work:
            <br />
            <Link href={url} className="text-xs">
              {url}
            </Link>
          </p>
        </Footer>
      }
    />
  );
}

export default function __TEST() {
  return <Content url="https://google.com" />;
}
