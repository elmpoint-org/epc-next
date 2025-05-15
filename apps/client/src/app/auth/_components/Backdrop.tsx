import dynamic from 'next/dynamic';

const BackdropImg = dynamic(() => import('./BackdropImg'), { ssr: false });

const Backdrop = () => {
  return (
    <>
      <BackdropImg className="fixed inset-0 bg-cover bg-right" />
      <div className="fixed inset-0 z-[4] bg-white/40"></div>
      <div className="_backdrop-brightness-90 fixed inset-0 z-[5] backdrop-blur backdrop-contrast-75 backdrop-saturate-50"></div>
    </>
  );
};
export default Backdrop;
