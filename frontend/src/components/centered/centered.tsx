import React, { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import './centered.scoped.scss';

type PropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { fullScreen?: boolean };

const Centered = forwardRef(
  (props: PropsType, ref: ForwardedRef<HTMLDivElement>) => {
    let clss = 'centered';
    if (props.fullScreen) {
      clss += ' centered-screen';
    } else {
      clss += ' centered-normal';
    }

    let filteredProps = { ...props };
    delete filteredProps.fullScreen;

    return <div className={clss} ref={ref} {...filteredProps} />;
  },
);

export default Centered;
