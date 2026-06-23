import React from "react";
import * as headings from "./style";

const Heading = (props) => {
  const { as, children, className, id, style, onClick } = props;
  const StyledHeading = as ? headings[as.toUpperCase()] : headings.H1;

  return (
    <StyledHeading
      className={className}
      id={id}
      style={style}
      onClick={onClick}
    >
      {children}
    </StyledHeading>
  );
};

export default Heading;
