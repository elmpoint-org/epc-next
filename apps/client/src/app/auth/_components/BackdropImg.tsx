const BackdropImg = ({ ...props }: JSX.IntrinsicElements['div']) => {
  return (
    <>
      <div
        {...props}
        style={{
          backgroundImage: 'url(/auth_bg.jpg)',
        }}
      />
    </>
  );
};
export default BackdropImg;
