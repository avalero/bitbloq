import React from "react";

const SvgEye = props => (
  <svg width="13" height="13" viewBox="0 0 13 13" {...props}>
    <defs>
      <rect id="b" width="293" height="143" rx="4" />
      <filter
        id="a"
        width="108.9%"
        height="118.2%"
        x="-4.4%"
        y="-7%"
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
      <path fill="#FBFBFB" d="M-910-490H370V611H-910z" />
      <path
        fill="#FFF"
        stroke="#C0C3C9"
        d="M-460-264h780v757a4 4 0 0 1-4 4h-776v-761z"
      />
      <path
        stroke="#C0C3C9"
        d="M-440-93h740v445.6a4.4 4.4 0 0 1-4.4 4.4h-731.2a4.4 4.4 0 0 1-4.4-4.4V-93z"
      />
      <g transform="translate(-13 -11)">
        <use fill="#000" filter="url(#a)" />
        <rect
          width="294"
          height="144"
          x="-.5"
          y="-.5"
          fill="#FFF"
          stroke="#CFCFCF"
          rx="4"
        />
      </g>
      <path
        fill="#373B44"
        d="M13 6.64c-1.14 2.44-3.614 4.346-6.483 4.346-2.875 0-5.353-1.913-6.49-4.358a.28.28 0 0 1 0-.237C1.163 3.945 3.641 2 6.516 2 9.387 2 11.859 3.938 13 6.378v.262zM6.519 3.01a3.492 3.492 0 0 0-3.501 3.484 3.49 3.49 0 0 0 3.5 3.482c1.932 0 3.5-1.56 3.5-3.482a3.491 3.491 0 0 0-3.5-3.483zm-.001 5.183a1.684 1.684 0 1 1 0-3.369 1.684 1.684 0 0 1 0 3.369z"
      />
    </g>
  </svg>
);

export default SvgEye;
