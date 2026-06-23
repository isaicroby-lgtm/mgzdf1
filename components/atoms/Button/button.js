import React from "react";
import { ButtonStyled } from "./style";
import theme from "../theme";

const Button = (props) => {
  const {
    type = "default",
    shape,
    icon,
    size,
    outlined,
    ghost,
    transparented,
    raised,
    squared,
    color,
    social,
    load,
    style,
    children,
    className,
    isLoading,
    white,
    disabled,

    ...rest
  } = props;

  return (
    <ButtonStyled
      className={className}
      style={style}
      squared={squared}
      outlined={outlined ? 1 : 0}
      ghost={ghost}
      transparent={transparented ? 1 : 0}
      raised={raised ? 1 : 0}
      data={type}
      size={size}
      shape={shape}
      type={type}
      icon={icon}
      color={color}
      social={social}
      loading={isLoading}
      white={white}
      disabled={disabled}
      theme={theme}
      {...rest}
    >
      {children}
    </ButtonStyled>
  );
};

export default Button;
