import React from "react";

const SvgEyeClose = props => (
  <svg width="60" height="60" viewBox="0 0 60 60" {...props}>
    <defs>
      <path
        id="b"
        d="M145 146h990a5 5 0 0 1 5 5v498a5 5 0 0 1-5 5H145a5 5 0 0 1-5-5V151a5 5 0 0 1 5-5z"
      />
      <filter
        id="a"
        width="113%"
        height="125.6%"
        x="-6.5%"
        y="-10.8%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="10" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="20"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-560 -358)">
      <path fill="#FBFBFB" d="M0 0h1280v800H0z" />
      <path
        fill="#000"
        fillOpacity=".4"
        fillRule="nonzero"
        d="M0 0h1280v800H0z"
      />
      <g fillRule="nonzero">
        <use fill="#000" filter="url(#a)" />
        <use fill="#FFF" />
      </g>
      <rect
        width="339"
        height="310"
        x="420.5"
        y="253.5"
        fill="#FFF"
        fillRule="nonzero"
        stroke="#979797"
        rx="4"
      />
      <path
        fill="#373B44"
        d="M609.957 374.57A36.788 36.788 0 0 1 620 387.436v1.208c-5.265 11.262-16.679 20.063-29.923 20.063-4.172 0-8.162-.873-11.836-2.421l-10.362 10.362a4.615 4.615 0 1 1-6.527-6.527l8.746-8.746a36.302 36.302 0 0 1-9.977-12.786 1.293 1.293 0 0 1 0-1.093c5.25-11.29 16.688-20.265 29.956-20.265 4.138 0 8.098.873 11.747 2.417l10.297-10.296a4.615 4.615 0 1 1 6.527 6.527l-8.691 8.691zm-5.693 5.693l-6.517 6.517c.067.41.102.831.102 1.26 0 4.292-3.48 7.773-7.768 7.773-.43 0-.853-.035-1.264-.103l-6.407 6.407a16.16 16.16 0 0 0 7.676 1.924c8.916 0 16.153-7.196 16.153-16.07 0-2.792-.716-5.42-1.975-7.708zm-6.575-6.479a16.144 16.144 0 0 0-7.603-1.888c-8.92 0-16.158 7.192-16.158 16.075 0 2.764.701 5.365 1.937 7.637l6.515-6.515a7.773 7.773 0 0 1 8.755-8.755l6.554-6.554z"
      />
    </g>
  </svg>
);

export default SvgEyeClose;
