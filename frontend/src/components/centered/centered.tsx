import './centered.css';

function Centered(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { screen?: boolean },
) {
  let clss = 'centered';
  if (props.screen) {
    clss += ' centered-screen';
  } else {
    clss += ' centered-normal';
  }

  return <div className={clss} {...props} />;
}

export default Centered;
