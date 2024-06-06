const BackdropImg = ({ ...props }: JSX.IntrinsicElements['div']) => {
  return (
    <>
      <div
        {...props}
        style={{
          backgroundImage:
            'url(https://epc-one.s3.us-east-1.amazonaws.com/photocontest/2017/yqcqjm3p1kfyi7luioma.jpg)',
          // 'url(https://res.cloudinary.com/epcphoto19/image/upload/v1658364083/ktlozof33it7e09zygpf.jpg)',
          // 'url(https://epc-one.s3.us-east-1.amazonaws.com/photocontest/2017/rhxuk8eukwhtig7vovv9.jpg)',
        }}
      />
    </>
  );
};
export default BackdropImg;
