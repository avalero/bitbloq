import React from "react";

const SvgStar = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient id="star_svg__a" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#4DB4FF" />
        <stop offset="100%" stopColor="#4DAEFF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#star_svg__a)"
        d="M38.99 18.216V46.2l13.001-7.314V10.903z"
        transform="translate(6 4)"
      />
      <path fill="#4DC3FF" d="M6 42.887L19 50.2V22.217L6 14.903z" />
      <path
        fill="url(#star_svg__a)"
        d="M9.931 28.543v27.985l16.07-4.877V23.668z"
        transform="translate(6 4)"
      />
      <path fill="#4DC3FF" d="M32 55.651l16.07 4.876V32.543L32 27.667z" />
      <path
        fill="#4DE1FF"
        d="M32 4l-8.035 9.395L6 14.903l13 7.313-3.069 10.327 16.07-4.876 16.067 4.876L45 22.216l13-7.313-17.965-1.508L32.001 4z"
      />
    </g>
  </svg>
);

export default SvgStar;
