import React from "react";

const SvgOctahedron = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="octahedron_svg__a"
        x1="7.219%"
        x2="102.147%"
        y1="24.994%"
        y2="80.369%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DC3FF" />
      </linearGradient>
      <linearGradient
        id="octahedron_svg__b"
        x1="100%"
        x2="0%"
        y1="0%"
        y2="75.178%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DC3FF" />
      </linearGradient>
    </defs>
    <g fill="none">
      <path fill="#4DC3FF" d="M32 2v36L0 31z" />
      <path
        fill="url(#octahedron_svg__a)"
        d="M64 29l-32 7V0z"
        transform="translate(0 2)"
      />
      <path
        fill="url(#octahedron_svg__b)"
        d="M32 29v24L0 60z"
        transform="matrix(1 0 0 -1 0 91)"
      />
      <path fill="#3598FB" d="M64 31l-32 7v24z" />
    </g>
  </svg>
);

export default SvgOctahedron;
