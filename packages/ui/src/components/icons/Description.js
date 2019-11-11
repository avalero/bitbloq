import React from "react";

const Description = props => (
  <svg width="13" height="13" viewBox="0 0 13 13" {...props}>
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
      <rect id="d" width="200" height="71" rx="4" />
      <filter
        id="c"
        width="113%"
        height="136.6%"
        x="-6.5%"
        y="-14.1%"
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
      <path
        fill="#373B44"
        d="M6.5 13a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zM4.655 5.606l-.11.455c.08-.03.178-.062.29-.097.115-.033.226-.05.334-.05.22 0 .368.037.447.111.078.075.117.207.117.395 0 .105-.012.222-.038.348-.025.126-.057.26-.094.403l-.418 1.48a4.683 4.683 0 0 0-.082.417 2.774 2.774 0 0 0-.024.363c0 .304.112.555.336.752.225.197.54.297.945.297.263 0 .496-.035.694-.104.2-.07.467-.17.801-.302l.112-.456c-.058.027-.15.06-.278.094-.13.036-.243.054-.345.054-.216 0-.368-.036-.455-.107-.088-.071-.132-.205-.132-.4 0-.079.013-.194.04-.346.028-.15.059-.285.092-.404l.417-1.475a2.31 2.31 0 0 0 .084-.447c.014-.161.022-.275.022-.34a.97.97 0 0 0-.326-.756c-.219-.194-.53-.292-.932-.292-.223 0-.459.04-.71.12-.25.079-.513.175-.787.287zM7.78 2.774a.988.988 0 0 0-.701-.274 1 1 0 0 0-.705.274.873.873 0 0 0-.293.657c0 .257.098.477.293.657.196.18.432.27.705.27.273 0 .507-.09.701-.27.195-.18.292-.4.292-.657a.871.871 0 0 0-.292-.657z"
      />
    </g>
  </svg>
);

export default Description;
