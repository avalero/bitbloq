import React, { FC } from "react";
import { IBloq, IBloqType } from "../../index";

interface IServoPositionIconProps {
  bloq?: IBloq;
}

const ServoPositionIcon: FC<IServoPositionIconProps> = ({ bloq }) => {
  const { parameters = {} } = bloq || {};
  const value: number =
    parameters.value !== undefined ? (parameters.value as number) : 90;

  return (
    <svg width={54} height={54} viewBox="0 0 24 24">
      <g fill="#323843" fillRule="evenodd">
        <g transform={`rotate(${value - 90},12,12)`}>
          <path d="M12 12.937a.938.938 0 01-.938-.939V5.185c0-.182.147-.329.328-.329h1.22c.181 0 .328.147.328.33v6.812a.938.938 0 01-.938.94" />
        </g>
        <path d="M24 12.001c0-6.658-5.449-12.066-12.12-12C5.274.066 0 5.548 0 12.154v.448c0 .186.15.336.336.336h2.002a.342.342 0 00.342-.342V11.32a.342.342 0 00-.342-.342h-.321a9.936 9.936 0 01.869-3.153l.261.153a.342.342 0 00.468-.125l.639-1.105a.341.341 0 00-.124-.467l-.255-.148a10.139 10.139 0 012.308-2.296l.141.248a.342.342 0 00.468.126l1.104-.639a.34.34 0 00.126-.466l-.142-.248a9.941 9.941 0 013.14-.845v.282c0 .189.153.342.341.342h1.278a.342.342 0 00.341-.342v-.282a9.947 9.947 0 013.141.845l-.142.248a.342.342 0 00.125.467l1.105.638a.34.34 0 00.467-.126l.143-.247a10.127 10.127 0 012.309 2.297l-.255.147a.341.341 0 00-.126.467l.639 1.106a.341.341 0 00.466.125l.264-.152a9.97 9.97 0 01.868 3.15h-.321a.342.342 0 00-.342.342v1.276c0 .189.154.342.342.342h2.001c.186 0 .336-.15.336-.336v-.601z" />
        <text fontFamily="Roboto-Black, Roboto" fontSize={10} fontWeight={700}>
          <tspan x={12} y={23.903} textAnchor="middle">
            {`${value}\xBA`}
          </tspan>
        </text>
      </g>
    </svg>
  );
};

export default ServoPositionIcon;
