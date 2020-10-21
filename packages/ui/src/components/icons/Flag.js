import * as React from "react";

function SvgFlag(props) {
  return (
    <svg viewBox="0 0 14 14" {...props}>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(-55 -3)">
          <path
            fill="#FFF"
            d="M57.296 12.724v3.26a.431.431 0 01-.431.432h-.85a.432.432 0 01-.432-.431V4.014c0-.238.194-.43.432-.43h.85a.43.43 0 01.43.43v.574h10.71a.41.41 0 01.335.648l-2.418 3.42 2.418 3.419a.41.41 0 01-.335.649h-10.71z"
          />
        </g>
      </g>
    </svg>
  );
}

export default SvgFlag;
