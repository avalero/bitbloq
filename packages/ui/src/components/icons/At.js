import React from "react";

const SvgAt = props => (
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
      <path fill="#FBFBFB" d="M-380-453H900V897H-380z" />
      <g transform="translate(-380 -453)">
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
        d="M12 14.101a2.103 2.103 0 0 1-2.101-2.1c0-1.16.942-2.102 2.1-2.102 1.16 0 2.102.942 2.102 2.101A2.103 2.103 0 0 1 12 14.101m2.112-6.922a5.249 5.249 0 0 0-2.6-.422c-2.47.225-4.48 2.196-4.746 4.661A5.271 5.271 0 0 0 12 17.265c1.34 0 2.563-.503 3.494-1.33a4.606 4.606 0 0 0 3.24 1.33A5.271 5.271 0 0 0 24 12C24 5.193 18.303-.308 11.427.013 5.285.301.3 5.285.013 11.426-.309 18.303 5.193 24 12 24c2.95 0 5.74-1.058 7.932-2.995a.72.72 0 0 0 .025-1.048l-1.224-1.224a.717.717 0 0 0-.978-.027 8.78 8.78 0 0 1-6.116 2.123c-4.58-.181-8.304-3.924-8.469-8.505-.18-5.02 3.85-9.16 8.83-9.16 4.872 0 8.836 3.964 8.836 8.836 0 1.18-.978 2.136-2.167 2.1a1.451 1.451 0 0 1-1.392-1.457V7.18a.444.444 0 0 0-.444-.444h-2.277a.444.444 0 0 0-.444.444"
      />
    </g>
  </svg>
);

export default SvgAt;
