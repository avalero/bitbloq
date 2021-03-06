import React from "react";
import { IShapeProps } from "../index";

const ActionShape: React.FunctionComponent<IShapeProps> = ({
  fill,
  stroke,
  strokeWidth,
  strokeDasharray
}) => {
  const path = `
    M 0,3
    A 3,3 0 0,1 3,0
    L 57,0
    A 3,3 0 0,1 60,3
    L 60,24
    A 7,7 0 0,1 60,36
    L 60,57
    A 3,3 0 0,1 57,60
    L 3,60
    A 3,3 0 0,1 0,57
    L 0,36
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

export default ActionShape;
