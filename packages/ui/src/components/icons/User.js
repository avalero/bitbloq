import React from "react";

const SvgUser = props => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <defs>
      <rect id="b" width="1180" height="1067" x="50" y="163" rx="4" />
      <filter
        id="a"
        width="100.9%"
        height="101%"
        x="-.5%"
        y="-.3%"
        filterUnits="objectBoundingBox"
      >
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="1.5"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0.780392157 0 0 0 0 0.780392157 0 0 0 0 0.780392157 0 0 0 1 0"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="#FBFBFB" d="M-380-689H900V661H-380z" />
      <g transform="translate(-380 -689)">
        <use fill="#000" filter="url(#a)" xlinkHref="#b" />
        <use fill="#FFF" xlinkHref="#b" />
      </g>
      <path
        fill="#FFF"
        stroke="#C0C3C9"
        d="M-16-18h842a4 4 0 0 1 4 4v56H-20v-56a4 4 0 0 1 4-4z"
      />
      <path
        fill="#373B44"
        d="M18.043 6c0 3.314-2.706 6-6.042 6-3.338 0-6.043-2.686-6.043-6 0-3.313 2.705-6 6.043-6 3.336 0 6.042 2.687 6.042 6zM1.385 24c-.817 0-1.477-.704-1.374-1.508C.757 16.576 5.84 12 12 12c6.159 0 11.242 4.576 11.988 10.492.103.804-.557 1.508-1.374 1.508H1.385z"
      />
    </g>
  </svg>
);

export default SvgUser;
