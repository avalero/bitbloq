import React from "react";

const SvgCombinedShape = props => (
  <svg viewBox="0 0 19 19" {...props}>
    <defs>
      <filter
        id="combined-shape_svg__a"
        width="101.7%"
        height="103.1%"
        x="-.8%"
        y="-1.5%"
        filterUnits="objectBoundingBox"
      >
        <feOffset in="SourceAlpha" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={2}
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
        />
      </filter>
      <path
        id="combined-shape_svg__b"
        d="M718 215v-37a3 3 0 013-3h34a3 3 0 013 3v37h10v285H50V215h166v-97a6 6 0 016-6h144a6 6 0 016 6v51a6 6 0 01-6 6h-44v40h396z"
      />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-441 -240)">
      <path fill="#FFF" d="M0 0h768v500H0z" />
      <use
        fill="#000"
        filter="url(#combined-shape_svg__a)"
        xlinkHref="#combined-shape_svg__b"
      />
      <use fill="#FFF" xlinkHref="#combined-shape_svg__b" />
      <path fill="#EEE" fillRule="nonzero" d="M350 228h410v258H350z" />
      <path
        d="M456.296 254.199l.343.344a7.909 7.909 0 001.77-4.266h-.489a.405.405 0 01-.405-.406v-.742c0-.224.181-.405.405-.405h.489a7.9 7.9 0 00-1.77-4.265l-.343.343a.405.405 0 01-.574 0l-.523-.523a.405.405 0 010-.574l.343-.344a7.913 7.913 0 00-4.266-1.77v.489a.405.405 0 01-.405.406h-.74a.406.406 0 01-.407-.406v-.49a7.913 7.913 0 00-4.266 1.77l.343.344a.405.405 0 010 .574l-.523.523a.405.405 0 01-.574 0l-.343-.343a7.907 7.907 0 00-1.77 4.265h.489c.224 0 .405.181.405.405v.742a.405.405 0 01-.405.406h-.49a7.916 7.916 0 001.77 4.266l.343-.344a.405.405 0 01.574 0l.523.524a.405.405 0 010 .574l-.342.342a7.902 7.902 0 004.265 1.77v-.489c0-.223.182-.404.406-.404h.74c.225 0 .406.181.406.404v.49a7.92 7.92 0 004.266-1.77l-.343-.343a.405.405 0 010-.574l.523-.524a.405.405 0 01.574 0zM450.5 240a9.5 9.5 0 110 19 9.5 9.5 0 010-19zm.776 9.179l2.046 2.046a.401.401 0 010 .568l-.528.53a.404.404 0 01-.569 0l-2.383-2.383a.405.405 0 01-.118-.284v-5.504c0-.221.18-.4.402-.4h.749a.4.4 0 01.401.4v5.028z"
        fill="currentColor"
      />
    </g>
  </svg>
);

export default SvgCombinedShape;
