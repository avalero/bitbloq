import React from "react";
import { IShapeProps } from "../index";

const WaitShape: React.FunctionComponent<IShapeProps> = ({
  fill,
  stroke,
  strokeWidth,
  strokeDasharray
}) => {
  const path = `
    M 0,24
    A 30.5,30.5 0 0,1 60,24
    A 7,7 0 0,1 60,36
    A 30.5,30.5 0 0,1 0,36
    A 7,7 0 0,0 0,24
    z
  `;

  return (
    <path
      d={path}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
    />
  );
};

export default WaitShape;
