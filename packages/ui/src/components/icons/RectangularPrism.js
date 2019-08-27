import React from "react";

const SvgRectangularPrism = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="rectangular-prism_svg__a"
        x1="0%"
        y1="56.091%"
        y2="85.849%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DC3FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#rectangular-prism_svg__a)"
        d="M50.621 9.46L25.311 1v61.686l25.31-8.46V26.379z"
        transform="translate(6)"
      />
      <path fill="#4DC3FF" d="M31.31 1L6 9.46v44.766l25.31 8.459z" />
      <path fill="#4DE1FF" d="M56.621 9.378L31.311.9 6 9.378l25.31 8.46z" />
    </g>
  </svg>
);

export default SvgRectangularPrism;
