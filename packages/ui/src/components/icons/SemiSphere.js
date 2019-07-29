import React from "react";

const SvgSemiSphere = props => (
  <svg width="1em" height="1em" viewBox="0 0 64 64" {...props}>
    <defs>
      <radialGradient
        id="semi-sphere_svg__a"
        cx="69.909%"
        cy="17.145%"
        r="100%"
        fx="69.909%"
        fy="17.145%"
        gradientTransform="matrix(0 1 -.79054 0 .835 -.528)"
      >
        <stop offset="0%" stopColor="#4DE1FF" />
        <stop offset="100%" stopColor="#4DA6FF" />
      </radialGradient>
    </defs>
    <path
      fill="url(#semi-sphere_svg__a)"
      fillRule="evenodd"
      d="M61.98 39.617c-.205-17.003-14.51-30.596-31.8-29.562C14.454 10.99 2 24.035 2 39.988l.001.012h.001c0 9.628 13.43 17.43 29.998 17.43 16.567 0 29.998-7.802 29.998-17.43 0-.128-.012-.254-.017-.383"
    />
  </svg>
);

export default SvgSemiSphere;
