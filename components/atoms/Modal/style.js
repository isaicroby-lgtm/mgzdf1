import Styled from "styled-components";
import { Modal } from "antd";

const ModalStyledColord = (type, theme, gradient) => `

  .ant-modal-content, .ant-modal-header {
    background: ${
      gradient ? gradient : type !== "default" && theme[`${type}-color`]
    } !important;
  }
  .ant-modal-title {
    color: #fff;
  }
  * { 
    color:${gradient ? "white" : "inherit"};
  }
  .ant-modal-footer button {
    background: #fff;
    color: #999;
    border: 1px solid #ffff;
  }
`;

const ModalStyled = Styled(Modal)`    
  ${({ theme, type, gradient }) =>
    type || (gradient && ModalStyledColord(type, theme, gradient))}
`;

export { ModalStyled, ModalStyledColord };
