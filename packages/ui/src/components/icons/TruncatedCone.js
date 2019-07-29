import React from 'react';

const SvgTruncatedCone = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <linearGradient
        id="truncated-cone_svg__a"
        x1="13.925%"
        x2="85.496%"
        y1="50%"
        y2="50%"
      >
        <stop offset="0%" stopColor="#4DA6FF" />
        <stop offset="100%" stopColor="#4DE1FF" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="url(#truncated-cone_svg__a)"
        d="M60 29.43c0-1.904-.663-3.728-1.874-5.414-1.885-2.621-7.74-10.596-13.557-18.654l-29.14.002C9.61 13.42 3.759 21.395 1.874 24.016.662 25.702 0 27.526 0 29.43c0 8.573 13.43 15.522 30 15.522 16.568 0 30-6.95 30-15.522z"
        transform="translate(2 10)"
      />
      <path
        fill="#4DE1FF"
        d="M48.071 19.295c0 5.133-7.195 9.294-16.071 9.294-8.876 0-16.071-4.161-16.071-9.294C15.929 14.16 23.124 10 32 10c8.876 0 16.071 4.161 16.071 9.295"
      />
    </g>
  </svg>
);

export default SvgTruncatedCone;
