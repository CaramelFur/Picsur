import React from 'react';
import './centered.css';

class Centered extends React.Component<
  React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > & { fullScreen?: boolean },
  any
> {
  render() {
    let clss = 'centered';
    if (this.props.fullScreen) {
      clss += ' centered-screen';
    } else {
      clss += ' centered-normal';
    }

    let filteredProps = { ...this.props };
    delete filteredProps.fullScreen;

    return <div className={clss} {...filteredProps} />;
  }
}

export default Centered;
