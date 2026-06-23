import Image from "next/image";
import React, { useState } from "react";
import theme from "../theme";

function ImageMagnifier({ imgUrl, imgAlt }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseHover = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });

    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 400,
      }}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseHover}
    >
      <Image
        fill={true}
        style={{ objectFit: "contain" }}
        src={imgUrl}
        alt={imgAlt || ""}
      />

      {showMagnifier && (
        <div
          style={{
            position: "absolute",
            left: `${cursorPosition.x - 100}px`,
            top: `${cursorPosition.y - 100}px`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              zIndex: 9999,
              borderRadius: 16,
              boxShadow: `0 0 3px ${theme["light-color"]}`,
              position: "relative",
              backgroundImage: `url(${imgUrl})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageMagnifier;
