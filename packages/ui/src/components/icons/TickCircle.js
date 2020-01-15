import React from "react";

const SvgTickCircle = props => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#FFF"
        fillRule="nonzero"
        d="M12 24C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12zm-2.162-9.809l-2.657-2.657a.72.72 0 0 0-1.017 0l-.953.954a.718.718 0 0 0 0 1.017l4.118 4.119a.72.72 0 0 0 1.018 0l8.442-8.443a.718.718 0 0 0 0-1.017l-.953-.954a.72.72 0 0 0-1.017 0l-6.981 6.981z"
      />
    </g>
  </svg>
);

export default SvgTickCircle;
