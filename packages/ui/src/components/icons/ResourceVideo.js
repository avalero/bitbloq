import React from "react";

const Video = props => (
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
        fill="#373B44"
        d="M16.76 8.685a.439.439 0 0 1 .695.356v5.754a.44.44 0 0 1-.713.343l-2.788-2.216v2.239c0 .3-.244.543-.544.543H6.977a.544.544 0 0 1-.543-.543V8.728c0-.3.243-.544.543-.544h6.433c.3 0 .544.244.544.544v1.976l2.805-2.02zm6.163 13.17V2.033A1.07 1.07 0 0 0 21.855.965H2.033A1.07 1.07 0 0 0 .965 2.033v19.822c0 .589.48 1.068 1.068 1.068h19.822a1.07 1.07 0 0 0 1.068-1.068zM21.855 0c1.121 0 2.033.912 2.033 2.033v19.822a2.036 2.036 0 0 1-2.033 2.033H2.033A2.035 2.035 0 0 1 0 21.855V2.033C0 .913.912 0 2.033 0h19.822z"
      />
    </g>
  </svg>
);

export default Video;
