import React from "react";
import chroma from "chroma-js";

const SvgViewColor = ({ color, closed, ...props }) => (
  <svg width="1em" height="1em" viewBox="0 0 484 200" {...props}>
    <defs>
      <path id="view_color_svg__d" d="M.189.066h155.308v81.418H.189z" />
      <path
        id="view_color_svg__g"
        d="M1.377 32.461a23.24 23.24 0 00-1.24 4.172 23.24 23.24 0 001.24 4.173c7.36 18.42 38.593 32.256 76.009 32.256s68.65-13.836 76.01-32.256a23.257 23.257 0 001.239-4.173 23.257 23.257 0 00-1.24-4.172C146.035 14.041 114.802.204 77.386.204S8.737 14.041 1.377 32.461"
      />
      <path
        id="view_color_svg__i"
        d="M.006 27.301c0 14.964 12.162 27.094 27.165 27.094 15.003 0 27.166-12.13 27.166-27.094C54.337 12.338 42.174.208 27.171.208S.006 12.338.006 27.3"
      />
      <path id="view_color_svg__l" d="M0 .053h85.526v105.784H0z" />
      <path id="view_color_svg__n" d="M0 .053h85.526v80.96H0z" />
      <path id="view_color_svg__p" d="M0 .053h85.526v35.324H0z" />
      <path
        id="view_color_svg__r"
        d="M.044 16.673c0 9.183 18.43 16.627 41.163 16.627 22.734 0 41.163-7.444 41.163-16.627S63.94.046 41.207.046C18.473.046.044 7.49.044 16.673"
      />
      <path id="view_color_svg__u" d="M.162.13H49.8v35.624H.16z" />
      <path id="view_color_svg__a" d="M299 1412h504v320H299z" />
      <radialGradient
        id="view_color_svg__j"
        r="50.133%"
        fx="50%"
        fy="50%"
        gradientTransform="matrix(.99735 0 0 1 .001 0)"
      >
        <stop offset="0%" stopColor="#00ABE5" />
        <stop offset="100%" stopColor="#272D95" />
      </radialGradient>
      <radialGradient
        id="view_color_svg__s"
        cx="51.099%"
        cy="112.276%"
        r="128.995%"
        fx="51.099%"
        fy="112.276%"
        gradientTransform="matrix(.0015 -1 .67917 .00626 -.252 1.627)"
      >
        <stop
          offset="0%"
          stopColor={chroma(color)
            .darken(1.775)
            .hex()}
        />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <linearGradient id="view_color_svg__f" x1="45.985%" y1="50%" y2="50%">
        <stop offset="0%" stopColor="#FFCDCD" />
        <stop offset="54.015%" stopColor="#FFE8E8" />
        <stop offset="100%" stopColor="#FFCDCD" />
      </linearGradient>
      <filter
        id="view_color_svg__c"
        width="101.2%"
        height="103%"
        x="-.6%"
        y="-1.5%"
        filterUnits="objectBoundingBox"
      >
        <feGaussianBlur
          in="SourceAlpha"
          result="shadowBlurInner1"
          stdDeviation={3}
        />
        <feOffset in="shadowBlurInner1" result="shadowOffsetInner1" />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          k2={-1}
          k3={1}
          operator="arithmetic"
          result="shadowInnerInner1"
        />
        <feColorMatrix
          in="shadowInnerInner1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
        />
      </filter>
      <rect
        id="view_color_svg__b"
        width={482}
        height={198}
        x={1}
        y={1}
        rx={10}
      />
      <mask
        id="view_color_svg__w"
        width={504}
        height={320}
        x={0}
        y={0}
        fill="#fff"
      >
        <use xlinkHref="#view_color_svg__a" />
      </mask>
    </defs>
    <g fill="none" fillRule="evenodd" transform="translate(-309 -1422)">
      <path stroke="#000" strokeWidth={2} d="M75 1367h798v413H75z" />
      <g fillRule="nonzero" transform="translate(309 1422)">
        <use fill="#FFF" xlinkHref="#view_color_svg__b" />
        <use
          fill="#000"
          filter="url(#view_color_svg__c)"
          xlinkHref="#view_color_svg__b"
        />
      </g>
      <g transform="translate(351 1468)">
        <g transform="translate(0 12.613)">
          <mask id="view_color_svg__e" fill="#fff">
            <use xlinkHref="#view_color_svg__d" />
          </mask>
          <path
            fill="#F1CAC1"
            d="M77.843 81.484c47.22 0 77.654-24.589 77.654-36.536 0 0-12.826-44.882-77.654-44.882C13.013.066.189 44.948.189 44.948c0 11.947 30.433 36.536 77.654 36.536"
            mask="url(#view_color_svg__e)"
          />
        </g>
        {closed && (
          <>
            <path
              fill="#E6C9C0"
              d="M154.301 53.69c0 22.158-34.264 40.12-76.532 40.12-42.267 0-76.532-17.962-76.532-40.12 0 0 34.265-44.351 76.532-44.351 42.268 0 76.532 44.35 76.532 44.35"
            />
            <path
              fill="#000"
              d="M77.77 95.047c-17.848 0-35.268-3.272-49.054-9.212C14.962 79.907 5.371 71.582 1.71 62.393a24.346 24.346 0 01-1.286-4.344l-.014-.081c-.235-1.465-.419-2.623-.41-4.285a1.237 1.237 0 012.474.014c-.008 1.46.146 2.423.378 3.88l.003.02c.253 1.29.64 2.595 1.153 3.88 7.18 18.018 38.201 31.096 73.761 31.096 35.56 0 66.581-13.078 73.762-31.096.512-1.284.9-2.59 1.152-3.878.23-1.476.38-2.55.38-3.91a1.237 1.237 0 012.475 0c0 1.543-.172 2.762-.414 4.314l-.008.046a24.347 24.347 0 01-1.287 4.344c-3.662 9.19-13.253 17.514-27.007 23.442-13.785 5.94-31.206 9.212-49.053 9.212"
            />
          </>
        )}
        {!closed && (
          <>
            <path
              fill="url(#view_color_svg__f)"
              d="M153.852 40.883c-7.36-18.42-38.593-32.257-76.01-32.257-37.416 0-68.648 13.837-76.008 32.257a23.233 23.233 0 00-1.24 4.172 23.233 23.233 0 001.24 4.172c7.36 18.42 38.592 32.257 76.009 32.257 37.416 0 68.649-13.837 76.009-32.257a23.214 23.214 0 001.239-4.172 23.214 23.214 0 00-1.24-4.172"
              transform="translate(0 12.613)"
            />
            <g transform="translate(.456 21.035)">
              <mask id="view_color_svg__h" fill="#fff">
                <use xlinkHref="#view_color_svg__g" />
              </mask>
              <path
                fill="#FFF"
                d="M122.805 36.633c0 23.765-19.317 43.03-43.144 43.03-23.828 0-43.145-19.265-43.145-43.03 0-23.764 19.317-43.03 43.145-43.03 23.827 0 43.144 19.266 43.144 43.03"
                mask="url(#view_color_svg__h)"
              />
            </g>
            <g transform="translate(52.946 30.367)">
              <mask id="view_color_svg__k" fill="#fff">
                <use xlinkHref="#view_color_svg__i" />
              </mask>
              <path
                fill="url(#view_color_svg__j)"
                d="M.006 27.301c0 14.964 12.162 27.094 27.165 27.094 15.003 0 27.166-12.13 27.166-27.094C54.337 12.338 42.174.208 27.171.208S.006 12.338.006 27.3"
                mask="url(#view_color_svg__k)"
              />
            </g>
            <g fill="#000">
              <path d="M96.313 57.668c0 8.921-7.251 16.153-16.196 16.153S63.921 66.59 63.921 57.668s7.251-16.154 16.196-16.154 16.196 7.233 16.196 16.154" />
              <path
                fillRule="nonzero"
                d="M156.323 57.429l.047.239-.047.24a24.458 24.458 0 01-1.305 4.395c-7.693 19.254-39.782 33.046-77.175 33.046-37.394 0-69.483-13.792-77.175-33.046a24.477 24.477 0 01-1.306-4.396l-.047-.24.047-.238a24.477 24.477 0 011.306-4.397C8.36 33.78 40.449 19.987 77.843 19.987c37.393 0 69.482 13.792 77.175 33.045a24.459 24.459 0 011.305 4.397zm-3.637-3.47c-7.227-18.085-38.364-31.468-74.843-31.468-36.48 0-67.617 13.383-74.843 31.468a22.083 22.083 0 00-1.126 3.709c.258 1.24.634 2.478 1.126 3.709 7.226 18.085 38.363 31.468 74.843 31.468 36.48 0 67.616-13.383 74.843-31.469.491-1.23.867-2.466 1.125-3.708a22.061 22.061 0 00-1.125-3.709z"
              />
            </g>
          </>
        )}
        <g transform="translate(308.95 .39)">
          <mask id="view_color_svg__m" fill="#fff">
            <use xlinkHref="#view_color_svg__l" />
          </mask>
          <path
            fill="#E7E7E7"
            d="M85.526 17.715C85.526 7.96 66.381.053 42.763.053 19.146.053 0 7.961 0 17.715v70.46c0 9.754 19.146 17.662 42.763 17.662 23.618 0 42.763-7.908 42.763-17.662v-70.46z"
            mask="url(#view_color_svg__m)"
          />
        </g>
        <g transform="translate(308.95 .39)">
          <mask id="view_color_svg__o" fill="#fff">
            <use xlinkHref="#view_color_svg__n" />
          </mask>
          <path
            fill={chroma(color)
              .darken(0.525)
              .hex()}
            d="M81.269 10.024C79.443 8.468 77.08 7.04 74.28 5.78c-3.09-1.39-6.712-2.576-10.733-3.502-3.842-.884-8.046-1.53-12.5-1.891-2.68-.218-5.45-.333-8.285-.333s-5.604.115-8.285.333c-4.453.36-8.658 1.007-12.5 1.891-4.02.926-7.643 2.111-10.733 3.502-2.8 1.26-5.162 2.689-6.988 4.245C1.53 12.35 0 14.958 0 17.714v44.494c.38.479.802.747 1.247.747 1.662 0 3.01-3.723 3.01-8.316V42.502c0-4.593 1.565-8.316 3.494-8.316 1.93 0 3.494 3.723 3.494 8.316v30.195c0 4.593 2.403 8.316 5.367 8.316s5.367-3.723 5.367-8.316V48.713c0-4.593 2.798-8.316 6.25-8.316 3.45 0 6.249 3.723 6.249 8.316v11.992c0 4.593 3.71 8.316 8.285 8.316 4.576 0 8.286-3.723 8.286-8.316v-.07c0-4.593 2.798-8.316 6.25-8.316 3.45 0 6.249 3.723 6.249 8.316v4.64c0 4.593 2.402 8.316 5.366 8.316 2.965 0 5.367-3.723 5.367-8.316V42.502c0-4.593 1.565-8.316 3.494-8.316 1.813 0 3.304 3.288 3.477 7.495.011.27.017.544.017.82h.015c.149 4.208 1.433 7.496 2.996 7.496.444 0 .866-.268 1.246-.747V17.715c0-2.757-1.53-5.366-4.257-7.69"
            mask="url(#view_color_svg__o)"
          />
        </g>
        <g transform="translate(308.95 .39)">
          <mask id="view_color_svg__q" fill="#fff">
            <use xlinkHref="#view_color_svg__p" />
          </mask>
          <path
            fill={color}
            d="M85.526 17.715c0 9.754-19.145 17.662-42.763 17.662C19.146 35.377 0 27.469 0 17.715 0 7.96 19.146.053 42.763.053c23.618 0 42.763 7.908 42.763 17.662"
            mask="url(#view_color_svg__q)"
          />
        </g>
        <g transform="translate(310.506 1.167)">
          <mask id="view_color_svg__t" fill="#fff">
            <use xlinkHref="#view_color_svg__r" />
          </mask>
          <path
            fill="url(#view_color_svg__s)"
            d="M.044 16.673c0 9.183 18.43 16.627 41.163 16.627 22.734 0 41.163-7.444 41.163-16.627S63.94.046 41.207.046C18.473.046.044 7.49.044 16.673"
            mask="url(#view_color_svg__t)"
          />
        </g>
        <g transform="translate(350.195 45.525)">
          <mask id="view_color_svg__v" fill="#fff">
            <use xlinkHref="#view_color_svg__u" />
          </mask>
          <path
            fill="#000"
            d="M46.324 35.754c-3.2 0-8.568-2.682-16.003-8.003C21.775 21.636 11.46 12.737.493 2.017A1.1 1.1 0 112.03.444C12.765 10.935 23.266 19.998 31.6 25.962c4.03 2.884 7.464 4.992 10.207 6.265 3.486 1.619 4.819 1.39 5.23 1.218.168-.07.563-.237.563-1.296 0-1.359-.666-4.049-3.673-9.267v-4.3c.402.597.78 1.308.94 1.57 3.273 5.385 4.933 9.422 4.933 11.997 0 2.193-1.196 3.024-1.91 3.324-.446.187-.968.281-1.567.281"
            mask="url(#view_color_svg__v)"
          />
        </g>
        {!closed && (
          <>
            <path
              stroke="#373A44"
              strokeDasharray="10,10"
              strokeLinecap="round"
              strokeWidth={3}
              d="M170.039 53.897h125.256"
            />
            <circle
              cx={232.685}
              cy={53.696}
              r={15.564}
              fill="#FFF"
              fillRule="nonzero"
              stroke="#373A44"
              strokeWidth={2}
            />
            <g fill="#7AC943" fillRule="nonzero">
              <path d="M229.8 56.286l-3.544-3.544a.96.96 0 00-1.357 0l-1.271 1.272a.958.958 0 000 1.356l5.494 5.495a.96.96 0 001.357 0l11.263-11.263a.958.958 0 000-1.357l-1.272-1.272a.96.96 0 00-1.356 0l-9.313 9.313z" />
            </g>
          </>
        )}
        {closed && (
          <>
            <path
              fillRule="nonzero"
              stroke="#373A44"
              strokeDasharray="10,10"
              strokeLinecap="round"
              strokeWidth="3"
              d="M170.039 53.897h62.646"
            />
            <circle
              cx="232.685"
              cy="53.696"
              r="15.564"
              fill="#FFF"
              fillRule="nonzero"
              stroke="#373A44"
              strokeWidth="2"
            />
            <g fill="#DF0000">
              <path d="M242.023 47.231v.174l-6.305 6.306 6.302 6.303-3.018 3.018-6.303-6.303-6.305 6.306h-.174l-2.874-2.873v-.174l6.306-6.306-6.303-6.303 3.019-3.018 6.302 6.303 6.306-6.306h.174z" />
            </g>
          </>
        )}
      </g>
      <use
        fillRule="nonzero"
        stroke="#373B44"
        strokeDasharray="6,6"
        strokeWidth={2}
        mask="url(#view_color_svg__w)"
        xlinkHref="#view_color_svg__a"
      />
    </g>
  </svg>
);

export default SvgViewColor;
