import React from "react";

const COLOR_VALUES = {
  white: ["#FFF", "#F8F8F8"],
  red: ["#F0161E", "#B61013"],
  green: ["#00B70C", "#008908"],
  blue: ["#0095D2", "#006F9E"],
  off: ["#E0E0E0", "#CDCDCD"]
};

const SvgLed = ({ color = "white", ...props }) => (
  <svg width={57} height={80} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#323843"
        d="M16.813 74.287a3.107 3.107 0 01-3.106-3.106V52.016a3.107 3.107 0 016.212 0v19.165a3.107 3.107 0 01-3.106 3.106m23.374 5.693a3.107 3.107 0 01-3.106-3.106V57.71a3.107 3.107 0 016.212 0v19.165a3.107 3.107 0 01-3.106 3.106"
      />
      <path
        fill={COLOR_VALUES[color] && COLOR_VALUES[color][0]}
        d="M57 46.253c0-6.937-12.76-12.56-28.5-12.56S0 39.316 0 46.253v8.5c0 6.935 12.76 12.56 28.5 12.56S57 61.687 57 54.752v-8.5z"
      />
      <path
        fill={COLOR_VALUES[color] && COLOR_VALUES[color][1]}
        fillOpacity={color === "off" ? 0.6 : 1}
        d="M57 46.253c0 6.937-12.76 12.56-28.5 12.56S0 53.19 0 46.253s12.76-12.56 28.5-12.56S57 39.316 57 46.253"
      />
      <path
        fill={COLOR_VALUES[color] && COLOR_VALUES[color][0]}
        fillOpacity={color === "off" ? 0.8 : 1}
        d="M52.104 20.649C52.104 9.245 41.536 0 28.5 0S4.896 9.245 4.896 20.649v25.604c0 4.694 10.568 8.499 23.604 8.499s23.604-3.805 23.604-8.5V20.65z"
      />
      <path
        fill={color === "white" ? "#F1F1F1" : "#FFF"}
        fillOpacity={color === "off" ? 0 : color === "white" ? 1 : 0.3}
        d="M12.722 45.745a3.363 3.363 0 01-3.36-3.364V20.648c0-1.954.512-3.846 1.523-5.625a3.358 3.358 0 014.583-1.259 3.365 3.365 0 011.258 4.587c-.427.752-.643 1.525-.643 2.297v21.733a3.363 3.363 0 01-3.36 3.364"
      />
    </g>
  </svg>
);

export default SvgLed;
