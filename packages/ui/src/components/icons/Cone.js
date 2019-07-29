import React from "react";

const SvgCone = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="cone_svg__a"
        x1="13.925%"
        x2="85.496%"
        y1="50%"
        y2="50%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <path
      fill="url(#cone_svg__a)"
      fillRule="evenodd"
      d="M32 60.054c15.464 0 28-6.503 28-14.526 0-1.782-.619-3.489-1.75-5.066C54.289 34.937 32 4 32 4S9.711 34.937 5.75 40.462C4.617 42.039 4 43.746 4 45.528c0 8.023 12.535 14.526 28 14.526"
    />
  </svg>
);

export default SvgCone;
