import React from "react";

const SvgInterrogation = props => (
  <svg width="1em" height="1em" viewBox="0 0 16 16" {...props}>
    <defs>
      <filter
        id="interrogation_svg__a"
        width="134.2%"
        height="122.3%"
        x="-17.1%"
        y="-9.4%"
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
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
      </filter>
      <rect
        id="interrogation_svg__b"
        width={380}
        height={583}
        x={450}
        y={230}
        rx={10}
      />
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-682 -693)">
      <rect
        width={1180}
        height={466}
        x={50}
        y={287}
        fill="#F1F1F1"
        fillRule="nonzero"
        rx={10}
      />
      <g fillRule="nonzero">
        <use
          fill="#000"
          filter="url(#interrogation_svg__a)"
          xlinkHref="#interrogation_svg__b"
        />
        <use fill="#FFF" xlinkHref="#interrogation_svg__b" />
      </g>
      <path
        fill="currentColor"
        d="M692.897 699.659c-.178.354-.489.746-.934 1.178l-.568.541a1.93 1.93 0 00-.612 1.203l-.028.428h-.002a.33.33 0 01-.329.326h-1.137a.33.33 0 01-.328-.326h-.002v-.005h.001c0-.654.08-1.175.238-1.563.16-.389.45-.772.875-1.149.424-.378.705-.685.846-.921.14-.237.21-.487.21-.75 0-.792-.365-1.189-1.095-1.189-.347 0-.624.107-.832.321-.209.213-.317.508-.327.882h-.001a.33.33 0 01-.33.33h-1.375a.33.33 0 01-.33-.33c.009-.894.298-1.595.867-2.1.569-.507 1.345-.76 2.328-.76.993 0 1.763.24 2.31.721.548.48.822 1.159.822 2.035 0 .398-.089.774-.267 1.128m-2.18 6.265c-.208.2-.484.301-.826.301-.341 0-.616-.1-.825-.301a1.014 1.014 0 01-.312-.763c0-.312.106-.57.32-.773.212-.203.485-.305.817-.305.333 0 .606.102.819.305.213.203.32.46.32.773 0 .308-.105.562-.313.763M690 693a8 8 0 100 16 8 8 0 000-16"
      />
    </g>
  </svg>
);

export default SvgInterrogation;
