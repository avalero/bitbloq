import * as React from "react";

function SvgSpinnerSmall(props) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 20 20" {...props}>
      <defs>
        <filter
          id="loader_svg__a"
          width="141%"
          height="316.7%"
          x="-20.5%"
          y="-91.7%"
          filterUnits="objectBoundingBox"
        >
          <feOffset dy={10} in="SourceAlpha" result="shadowOffsetOuter1" />
          <feGaussianBlur
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
            stdDeviation={20}
          />
          <feColorMatrix
            in="shadowBlurOuter1"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
        </filter>
        <path
          id="loader_svg__b"
          d="M948 720h307a5 5 0 015 5v50a5 5 0 01-5 5H948a5 5 0 01-5-5v-50a5 5 0 015-5z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <path fill="#FFF" d="M-963-740H317V60H-963z" />
        <g fillRule="nonzero" transform="translate(-963 -740)">
          <use
            fill="#000"
            filter="url(#loader_svg__a)"
            xlinkHref="#loader_svg__b"
          />
          <use fill="#FFF" xlinkHref="#loader_svg__b" />
        </g>
        <path
          fill="currentColor"
          d="M9.217 0v3.477a6.534 6.534 0 00-5.76 6.493c0 3.61 2.922 6.538 6.528 6.538 3.605 0 6.528-2.927 6.528-6.538a6.534 6.534 0 00-.7-2.95l2.802-2.081a9.963 9.963 0 011.354 5.031c0 5.522-4.47 10-9.984 10C4.47 19.97 0 15.492 0 9.97 0 4.706 4.061.393 9.217 0z"
        />
      </g>
    </svg>
  );
}

export default SvgSpinnerSmall;
