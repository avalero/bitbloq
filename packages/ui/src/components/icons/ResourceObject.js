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
        d="M16.066 14.324v-4.195l-3.634 2.098v4.195l3.634-2.098zm-4.122-2.941l3.636-2.1-3.636-2.098-3.636 2.099 3.636 2.099zm4.853-2.522c.15.086.244.248.244.422v5.322a.489.489 0 0 1-.244.422l-4.609 2.662a.488.488 0 0 1-.488 0l-4.609-2.662a.489.489 0 0 1-.244-.422v-5.32a.49.49 0 0 1 .244-.424l4.61-2.662a.49.49 0 0 1 .487 0l4.61 2.662zm6.126 12.994V2.033A1.07 1.07 0 0 0 21.855.965H2.033A1.07 1.07 0 0 0 .965 2.033v19.822c0 .589.48 1.068 1.068 1.068h19.822a1.07 1.07 0 0 0 1.068-1.068zM21.855 0c1.121 0 2.033.912 2.033 2.033v19.822a2.036 2.036 0 0 1-2.033 2.033H2.033A2.036 2.036 0 0 1 0 21.855V2.033C0 .913.912 0 2.033 0h19.822z"
      />
    </g>
  </svg>
);

export default ResourceImage;
