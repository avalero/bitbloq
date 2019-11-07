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
      <path fill="#FBFBFB" d="M-160-400h1280v800H-160z" />
      <path
        fill="#000"
        fillOpacity=".4"
        fillRule="nonzero"
        d="M-160-400h1280v800H-160z"
      />
      <g fillRule="nonzero" transform="translate(-160 -400)">
        <use fill="#000" filter="url(#a)" />
        <use fill="#FFF" />
      </g>
      <path fill="#EEE" fillRule="nonzero" d="M-20-8h259v40H-20" />
      <path
        fill="#373B44"
        d="M9.77 10.918v4.597c0 .144.114.26.255.26h.41c.142 0 .257-.116.257-.26v-4.597a.258.258 0 0 0-.256-.26h-.41a.258.258 0 0 0-.257.26zm1.713 0v4.597c0 .144.115.26.256.26h.41a.258.258 0 0 0 .256-.26v-4.597a.258.258 0 0 0-.256-.26h-.41a.258.258 0 0 0-.256.26zm1.714 0v4.597c0 .144.115.26.256.26h.41c.142 0 .23-.116.23-.26v-4.597c0-.144-.088-.26-.23-.26h-.41a.258.258 0 0 0-.256.26zm-4.245 5.136l.03-6.252 5.972-.011-.041 6.088c-.015.344-.166.702-.504.702l-4.758.016c-.339 0-.685-.2-.7-.543zm7.663-7.943v-.443a.399.399 0 0 0-.396-.402h-3.008V6.56c0-.067-.05-.115-.113-.126h-2.335c-.062.01-.112.06-.112.126v.707H7.67a.399.399 0 0 0-.396.402v.443h9.342zm-1.866 9.337c.338 0 .98-.233.995-.577l-.001-7.901H8.135l.006 7.717c.015.337.236.752.562.769h2.54l3.506-.008zM21.855 0c1.121 0 2.033.912 2.033 2.033v19.822a2.035 2.035 0 0 1-2.033 2.033H2.033A2.035 2.035 0 0 1 0 21.855V2.033C0 .913.912 0 2.033 0h19.822z"
      />
    </g>
  </svg>
);

export default ResourceImage;
