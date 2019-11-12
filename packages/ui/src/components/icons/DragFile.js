import React from "react";

const SvgDrag = props => (
  <svg width="60" height="60" viewBox="0 0 60 60" {...props}>
    <defs>
      <path
        id="c"
        d="M285 189h710a5 5 0 0 1 5 5v441a5 5 0 0 1-5 5H285a5 5 0 0 1-5-5V194a5 5 0 0 1 5-5z"
      />
      <filter
        id="b"
        width="118.1%"
        height="128.8%"
        x="-9%"
        y="-12.2%"
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
      <rect id="a" width="620" height="200" x="330" y="330" rx="4" />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-607 -357)">
      <path fill="#FBFBFB" d="M0 0h1280v800H0z" />
      <path
        fill="#000"
        fillOpacity=".4"
        fillRule="nonzero"
        d="M0 0h1280v800H0z"
      />
      <g fillRule="nonzero">
        <use fill="#000" filter="url(#b)" />
        <use fill="#FFF" />
      </g>
      <path
        fill="#FFF"
        fillRule="nonzero"
        stroke="#DDD"
        d="M310 310h660v240H310z"
      />
      <use
        fill="#FFF"
        fillRule="nonzero"
        stroke="#979797"
        strokeDasharray="10,10"
        strokeWidth="2"
        mask="url(#d)"
      />
      <path
        fill="#373B44"
        d="M646.991 389.491v5.054l8.634 8.486a.706.706 0 0 1-.482 1.21l-7.188.137 4.334 10.217a.965.965 0 0 1-.512 1.266l-2.504 1.062a.965.965 0 0 1-1.266-.512l-4.34-10.23-5.306 5.224a.706.706 0 0 1-1.201-.503v-9.473h-19.405a3.259 3.259 0 0 1-3.255-3.255v-25.981a3.259 3.259 0 0 1 3.255-3.255h8.675v-3.673h2.446v3.673h14.86a3.259 3.259 0 0 1 3.255 3.255v14.853h3.666v2.445h-3.666zm-2.445 0h-.002v-2.445h.002v-14.853a.81.81 0 0 0-.81-.81h-25.98a.81.81 0 0 0-.81.81v25.98c0 .447.363.81.81.81h19.404v-12.417a.706.706 0 0 1 1.201-.504l6.185 6.079v-2.65zm11.93-8.265v-6.113h2.446v6.113h-2.446zm-11.932-21.78V357h6.113v2.446h-6.113zm-9.849 0V357h6.113v2.446h-6.113zm-3.735 0h-1.274a.81.81 0 0 0-.81.81v1.273h-2.446v-1.274a3.259 3.259 0 0 1 3.256-3.255h1.274v2.446zm25.516 11.932v-6.113h2.446v6.113h-2.446zm-2.083 15.668h1.273a.81.81 0 0 0 .81-.81v-1.274h2.446v1.274a3.259 3.259 0 0 1-3.256 3.255h-1.273v-2.445zm2.083-25.517v-1.274a.81.81 0 0 0-.81-.81h-1.273V357h1.273a3.259 3.259 0 0 1 3.256 3.255v1.274h-2.446z"
      />
    </g>
  </svg>
);

export default SvgDrag;
