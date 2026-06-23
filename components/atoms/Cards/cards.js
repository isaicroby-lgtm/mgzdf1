import React from "react";

import Heading from "../Heading";
import theme from "../theme";
import { CardFrame } from "./style";

const Cards = (props) => {
  const {
    title,
    children,
    size,
    headless,
    caption,
    isbutton,
    bodyStyle,
    headStyle,
    border = false,
    bodypadding,
    is,
  } = props;
  return (
    <>
      {!headless ? (
        <CardFrame
          theme={theme}
          size={size}
          title={title}
          bodyStyle={bodyStyle && bodyStyle}
          headStyle={headStyle && headStyle}
          bordered={border}
          bodypadding={bodypadding && bodypadding}
          extra={<>{isbutton && isbutton}</>}
          style={{ width: "100%" }}
          is={is}
        >
          {children}
        </CardFrame>
      ) : (
        <CardFrame
          theme={theme}
          bodypadding={bodypadding && bodypadding}
          bodyStyle={bodyStyle && bodyStyle}
          size={size}
          style={{ width: "100%" }}
          bordered={border}
          is={is}
        >
          {title && <Heading as="h4">{title}</Heading>}
          {caption && <p>{caption}</p>}
          {children}
        </CardFrame>
      )}
    </>
  );
};

export default Cards;
