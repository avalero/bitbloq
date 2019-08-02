import React from "react";

const SvgHollowCylinder = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient id="hollow-cylinder_svg__a" x1="0%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
      <linearGradient
        id="hollow-cylinder_svg__b"
        x1="100%"
        x2="0%"
        y1="50%"
        y2="50%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#hollow-cylinder_svg__a)"
        d="M.012 14.537v32.827c0 8.023 11.192 14.527 25 14.527 13.807 0 25-6.504 25-14.527V14.537c0-8.023-11.193-14.527-25-14.527-13.808 0-25 6.504-25 14.527"
        transform="translate(7 1)"
      />
      <path
        fill="url(#hollow-cylinder_svg__b)"
        stroke="#4DE1FF"
        strokeWidth={6}
        d="M25 26.054c12.369 0 22-5.597 22-11.527C47 8.597 37.369 3 25 3 12.63 3 3 8.596 3 14.527c0 5.93 9.63 11.527 22 11.527z"
        transform="translate(7 1)"
      />
    </g>
  </svg>
);

export default SvgHollowCylinder;
