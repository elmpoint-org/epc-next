import { Footer, Link, Prose, Title, Wrapper } from '../components';
import { send } from '../resend';
import { Senders } from '../senders';

/** verify a user's email address for registration. */
export async function emailRegistration(emailAddress: string, props: Props) {
  return send(
    {
      to: emailAddress,
      from: Senders.AUTH,
      subject: SUBJECT,
      react: Content({
        ...props,
        // date: dateTSObject(props.date).format('dddd, MMMM D'),
        date: '',
      }),
    },
    { fallback: true }
  );
}

type Props = {
  date: number;
  name: string;
  url: string;
};

const SUBJECT = 'Your upcoming stay at Elm Point';
function Content({ url, name, date }: Omit<Props, 'date'> & { date: string }) {
  return (
    <Wrapper
      children={
        <>
          <Prose>
            <Title>Your stay is coming up soon!</Title>
            <p>Hi, {name}!</p>
            <p>
              You have an upcoming stay on the Elm Point calendar beginning{' '}
              <b>{date}</b>.
            </p>
            <p></p>
          </Prose>
          {/* <Button href={url}>Click here</Button> */}
        </>
      }
      footer={
        <Footer className="!break-normal">
          <p className="max-w-[384px] mx-auto ">
            You’re receiving this message because you have enabled calendar
            reminders. Click <Link href="">here</Link> to edit your preferences
            or unsubscribe.
          </p>
        </Footer>
      }
    />
  );
}

export default function __TEST() {
  return (
    <Content
      name="Person"
      date="Sunday, March 4"
      url="https://google.com"
      //
    />
  );
}
