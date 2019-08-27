import React from "react";

const SvgTorus = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <radialGradient
        id="torus_svg__a"
        cy="75.317%"
        r="48.952%"
        fx="50%"
        fy="75.317%"
        gradientTransform="matrix(-.50226 0 0 -1.30978 .751 1.74)"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="85.741%" stopColor="#4DD1FF" />
        <stop offset="100%" stopColor="#4DD1FF" />
      </radialGradient>
      <radialGradient
        id="torus_svg__b"
        cy="23.365%"
        r="147.044%"
        fx="50%"
        fy="23.365%"
        gradientTransform="matrix(.50223 0 0 .53299 .249 .11)"
      >
        <stop offset="0%" stopColor="#4DD1FF" />
        <stop offset="68.563%" stopColor="#4DD1FF" />
        <stop offset="100%" stopColor="#4DA6FF" />
      </radialGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#torus_svg__a)"
        d="M55.353 32.144c-4.776 0-8.647-3.884-8.647-8.677 0-1.867-5.556-6.113-14.707-6.113-9.15 0-14.706 4.246-14.706 6.113 0 4.793-3.872 8.677-8.646 8.677C3.87 32.144 0 28.26 0 23.467 0 10.308 14.056 0 32 0c17.943 0 32 10.308 32 23.467 0 4.793-3.872 8.677-8.647 8.677"
        transform="translate(0 9)"
      />
      <path
        fill="url(#torus_svg__b)"
        d="M32 46.143c-17.944 0-32-10.307-32-23.466C0 17.884 3.872 14 8.647 14s8.646 3.884 8.646 8.677c0 1.866 5.557 6.112 14.707 6.112s14.707-4.246 14.707-6.112c0-4.793 3.87-8.677 8.646-8.677C60.128 14 64 17.884 64 22.677c0 13.159-14.056 23.466-32 23.466"
        transform="translate(0 9)"
      />
    </g>
  </svg>
);

export default SvgTorus;
