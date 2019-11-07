import React from "react";

const CloudLogo = props => (
  <svg width="40" height="40" viewBox="0 0 40 40" {...props}>
    <defs>
      <rect id="b" width="205" height="96" rx="4" />
      <filter
        id="a"
        width="112.7%"
        height="127.1%"
        x="-6.3%"
        y="-10.4%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology
          in="SourceAlpha"
          operator="dilate"
          radius="1"
          result="shadowSpreadOuter1"
        />
        <feOffset dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation="3.5"
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
        />
      </filter>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path fill="#FBFBFB" d="M-1039-63H241v951h-1280z" />
      <g transform="translate(-14 -10)">
        <use fill="#000" filter="url(#a)" />
        <rect
          width="206"
          height="97"
          x="-.5"
          y="-.5"
          fill="#FFF"
          stroke="#CFCFCF"
          rx="4"
        />
      </g>
      <path
        fill="#6878F5"
        d="M38.086 36.523V3.477c0-.862-.701-1.563-1.563-1.563H3.477c-.862 0-1.563.7-1.563 1.563v33.046c0 .862.7 1.563 1.563 1.563h33.046c.862 0 1.563-.7 1.563-1.563zM36.523 0A3.476 3.476 0 0 1 40 3.477v33.046A3.476 3.476 0 0 1 36.523 40H3.477A3.476 3.476 0 0 1 0 36.523V3.477A3.476 3.476 0 0 1 3.477 0h33.046zM25.198 21.416V19.51a1.084 1.084 0 0 0-2.166 0v1.906a1.084 1.084 0 0 0 2.166 0zm-8.232 0V19.51a1.084 1.084 0 0 0-2.165 0v1.906a1.083 1.083 0 0 0 2.165 0zm12.015-4.62c2.16.435 3.743 2.34 3.762 4.523 0 4.257-5.359 7.347-12.743 7.347-5.879 0-12.744-1.913-12.744-7.302 0-2.307 1.67-4.243 3.971-4.605l.48-.075-.082-.48a2.733 2.733 0 0 1-.042-.473c0-1.533 1.261-2.779 2.81-2.779.669 0 1.315.235 1.82.66l.485.41.26-.58c.962-2.147 2.111-4.076 5.568-4.076 4.205 0 6.088 3.272 6.088 6.515 0 .139-.006.275-.016.412l-.03.42.413.084z"
      />
    </g>
  </svg>
);

export default CloudLogo;
