import React from "react";
import * as texts from "./style";

const Text = (props) => {
  const { as, children, className, style, id, onClick } = props;
  const StyledTextAtom = as ? texts[as.toUpperCase()] : texts.P1;

  return (
    <StyledTextAtom
      className={className}
      id={id}
      style={style}
      onClick={onClick}
    >
      {children}
    </StyledTextAtom>
  );
};

export default Text;
