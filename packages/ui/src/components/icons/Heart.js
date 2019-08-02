import React from "react";

const SvgHeart = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient id="heart_svg__a" x1="0%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DC1FF" />
      </linearGradient>
      <linearGradient id="heart_svg__b" x1="0%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="#4DC3FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#4DE1FF"
        d="M32 36.732C19.888 32.364 5 24.98 5 14.494 5 9.25 11.045 5 18.5 5 25.957 5 32 9.25 32 14.494 32 9.25 38.044 5 45.5 5S59 9.25 59 14.494c0 10.487-14.887 17.87-27 22.238"
      />
      <path
        fill="url(#heart_svg__a)"
        d="M0 9.5v23.722c0 10.486 14.889 17.87 27 22.238V31.738C14.889 27.371 0 19.987 0 9.5"
        transform="matrix(-1 0 0 1 59 5)"
      />
      <path
        fill="url(#heart_svg__b)"
        d="M54 9.5v23.72c0 10.487-14.889 17.87-27 22.238v-23.72C39.111 27.37 54 19.985 54 9.5"
        transform="matrix(-1 0 0 1 59 5)"
      />
    </g>
  </svg>
);

export default SvgHeart;
