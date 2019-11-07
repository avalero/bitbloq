import React from "react";

const ResourceImage = props => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
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
    <g fill="none" fillRule="evenodd">
      <path
        fill="currentColor"
        d="M22.923 21.855V2.033A1.07 1.07 0 0 0 21.855.965H2.033A1.07 1.07 0 0 0 .965 2.033v19.822c0 .589.48 1.068 1.068 1.068h19.822a1.07 1.07 0 0 0 1.068-1.068zM21.855 0c1.121 0 2.033.912 2.033 2.033v19.822a2.036 2.036 0 0 1-2.033 2.033H2.033A2.036 2.036 0 0 1 0 21.855V2.033C0 .913.912 0 2.033 0h19.822zm-5.359 15.429v-6.97H7.392v6.97h1.19l1.78-3.559a.654.654 0 0 1 1.168 0l1.78 3.559h3.186zm.04-7.999a.99.99 0 0 1 .99.99v7.049a.99.99 0 0 1-.99.99H7.353a.99.99 0 0 1-.99-.99v-7.05a.99.99 0 0 1 .99-.989h9.185zm-1.96 4.033a1.051 1.051 0 1 1 0-2.103 1.051 1.051 0 0 1 0 2.103z"
      />
    </g>
  </svg>
);

export default ResourceImage;
