import React from "react";

import { ModalStyled } from "./style";
import Button from "../Button";

const Modal = (props) => {
  const {
    okText,
    onCancel,
    bodyStyle,
    className = "atbd-modal",
    onOk,
    visible,
    title,
    type,
    color,
    footer,
    width = 620,
    children,
    gradient,
    isLoading,
    extraFooter = [],
    styles = {},
  } = props;

  return (
    <ModalStyled
      title={title}
      styles={{
        ...styles,
        body: bodyStyle,
      }}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      type={color ? type : false}
      width={width}
      gradient={gradient}
      className={className}
      footer={
        footer || footer === null
          ? footer
          : [
              ...extraFooter,
              <Button type="secondary" key="back" outlined onClick={onCancel}>
                Anulează
              </Button>,
              <Button
                type={type}
                key="submit"
                outlined
                onClick={onOk}
                isLoading={isLoading}
              >
                {okText || "Sunt sigur"}
              </Button>,
            ]
      }
    >
      {children}
    </ModalStyled>
  );
};

export default Modal;
