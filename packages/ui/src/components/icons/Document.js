import React from "react";

const SvgDocument = props => (
  <svg width="28" height="28" viewBox="0 0 28 28" {...props}>
    <g fill="none" fillRule="evenodd">
      <path fill="#FBFBFB" d="M-70-182h1280v800H-70z" />
      <path
        fill="#FFF"
        stroke="#C0C3C9"
        d="M-16-16h1172a4 4 0 0 1 4 4v56H-20v-56a4 4 0 0 1 4-4z"
      />
      <path
        fill="#373B44"
        d="M2.625.25v27.5c0 .138.112.25.25.25h22.25a.25.25 0 0 0 .25-.25V7.74a.25.25 0 0 0-.073-.177L17.819.073A.25.25 0 0 0 17.643 0H2.875a.25.25 0 0 0-.25.25zm1.83 1.583h11.996V8.68c0 .138.112.25.25.25h6.845V26.17H4.456V1.832zm13.827 1.294l3.968 3.972h-3.968V3.127z"
      />
    </g>
  </svg>
);

export default SvgDocument;
