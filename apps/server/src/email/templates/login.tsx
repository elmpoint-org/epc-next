import { Button, Footer, Link, Prose, Title, Wrapper } from '../components';
import { send } from '../send';
import { BrevoSenders, Senders } from '../senders';

export async function emailLogin(
  to: string,
  { url, firstName }: { url: string; firstName?: string }
) {
  return send(
    {
      to,
      from: Senders.AUTH,
      brevoFrom: BrevoSenders.AUTH,
      subject: SUBJECT,
      react: Content({ url, firstName }),
    },
    { fallback: true }
  );
}

const SUBJECT = 'Login link for Elm Point';
function Content({ url, firstName }: { url: string; firstName?: string }) {
  return (
    <Wrapper
      children={
        <>
          <Prose>
            <Title>Sign in to your account</Title>
            <p className="-mb-1">Hi{firstName ? ' ' + firstName : ''}!</p>
            <p className="pb-4">
              Click the link below to sign in to your account.
            </p>
          </Prose>
          <Button href={url}>Click here</Button>
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
  return <Content url="https://google.com" firstName="Example" />;
}
