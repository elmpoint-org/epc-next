import Logo from '../nav/Logo';

export default function LogoPanel() {
  return (
    <>
      <div className="rounded-lg bg-dgreen fill-dwhite px-12 py-4">
        <Logo className="w-full" />
        <span className="sr-only">Elm Point</span>
      </div>
    </>
  );
}
