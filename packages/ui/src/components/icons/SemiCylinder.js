import React from "react";

const SvgSemiCylinder = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="semi-cylinder_svg__a"
        x1="0%"
        x2="176.374%"
        y1="50%"
        y2="50%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="#4DD7FF" d="M52.54 36.22L24.76 64V31.956l27.78-27.78z" />
      <path
        fill="url(#semi-cylinder_svg__a)"
        d="M0 16.067v32.042C0 54.04 5.533 59.216 13.76 62V2.176C5.533 4.96 0 10.136 0 16.066"
        transform="translate(11 2)"
      />
      <path
        fill="#4DE1FF"
        d="M38.65 2C23.378 2 11 9.193 11 18.067c0 5.93 5.533 11.106 13.76 13.889l27.78-27.78C48.457 2.797 43.714 2 38.65 2"
      />
    </g>
  </svg>
);

export default SvgSemiCylinder;
