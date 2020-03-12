import React from "react";

function CustomSvg(props) {
  const { src } = props;
  return <img src={src} alt="" />;
}

export default CustomSvg;
