import React from "react";

const Skeleton = ({ width, height, borderRadius, circle, className = "", style = {} }) => {
  return (
    <div
      className={`skeleton ${circle ? "skeleton-circle" : ""} ${className}`}
      style={{
        width: width || (circle ? height : "100%"),
        height: height || "20px",
        borderRadius: borderRadius || (circle ? "50%" : "8px"),
        ...style,
      }}
    />
  );
};

export default Skeleton;
