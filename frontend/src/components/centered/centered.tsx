import React, { ForwardedRef } from 'react';
import { forwardRef } from 'react';
import './centered.scoped.scss';

type PropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Centered = forwardRef(
  (props: PropsType, ref: ForwardedRef<HTMLDivElement>) => {
    let filteredProps = { ...props };

    return <div className="centered" ref={ref} {...filteredProps} />;
  },
);

export default Centered;
