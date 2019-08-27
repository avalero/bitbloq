import React from "react";

const SvgSemiCylinder = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="semi-cylinder_svg__a"
        x1="0%"
        y1="56.091%"
        y2="85.849%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DC3FF" />
      </linearGradient>
      <linearGradient
        id="semi-cylinder_svg__b"
        x1="28.411%"
        x2="53.376%"
        y1="80.036%"
        y2="26.372%"
      >
        <stop offset="0%" stopColor="#4DC3FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#semi-cylinder_svg__a)"
        d="M47.975 20.607C39.143 25.686 31.983 37.87 31.983 47.82l31.983-18.392c0-9.95-7.16-13.9-15.991-8.82"
        transform="translate(0 8)"
      />
      <path
        fill="url(#semi-cylinder_svg__b)"
        d="M31.983 47.82c0-9.95 7.16-22.134 15.991-27.213 4.249-2.443 8.11-2.797 10.975-1.398L26.965.817C24.101-.582 20.24-.228 15.992 2.215 7.16 7.294 0 19.478 0 29.428L31.983 47.82z"
        transform="translate(0 8)"
      />
    </g>
  </svg>
);

export default SvgSemiCylinder;
