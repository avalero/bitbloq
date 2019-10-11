import React, { FC } from "react";
import { IBloq, IBloqType } from "../../index";

interface IServoPositionIconProps {
  bloq?: IBloq;
}

const ServoPositionIcon: FC<IServoPositionIconProps> = ({ bloq }) => {
  const value = bloq && bloq.parameters && bloq.parameters.value;

  if (!value) {
    return (
      <svg width="1em" height="1em" viewBox="0 0 44 44">
        <path
          fillRule="evenodd"
          d="M18.714 29.697a3.251 3.251 0 011.855-2.448l-1.75-10.404a.698.698 0 111.377-.232l1.74 10.342a3.248 3.248 0 013.194 2.743l13.396-5.765a18.401 18.401 0 00-16.604-10.458c-7.11 0-13.548 4.08-16.604 10.458l13.396 5.764zM40.2 24.021a.744.744 0 01-.39.978L22.217 32.57a.757.757 0 01-.588 0L4.033 24.999a.744.744 0 01-.39-.978 19.891 19.891 0 0118.28-12.033A19.89 19.89 0 0140.2 24.02z"
        />
      </svg>
    );
  }

  return (
    <svg width="1em" height="1em" viewBox="0 0 44 44">
      <g fillRule="evenodd">
        <path d="M14.376 15.486a2.66 2.66 0 011.518-2.003l-1.432-8.51a.571.571 0 011.127-.19l1.423 8.46a2.657 2.657 0 012.612 2.243l10.957-4.716a15.051 15.051 0 00-13.58-8.554A15.051 15.051 0 003.418 10.77l10.957 4.716zm17.574-4.643a.609.609 0 01-.318.8l-14.391 6.193a.619.619 0 01-.481 0L2.368 11.642a.608.608 0 01-.318-.8A16.27 16.27 0 0117 1a16.27 16.27 0 0114.95 9.843z" />
        <text
          fontFamily="Roboto-Bold, Roboto"
          fontSize={18}
          fontWeight="bold"
          opacity={0.9}
          textAnchor="middle"
        >
          <tspan x={21.792} y={39}>
            {`${value}\xBA`}
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default ServoPositionIcon;
