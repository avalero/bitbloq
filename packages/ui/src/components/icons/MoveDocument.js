import React from "react";

const SvgMoveDocument = props => (
<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" {...props}>
    <defs>
        <rect id="b" width="179" height="143" rx="4"/>
        <filter id="a" width="114.5%" height="118.2%" x="-7.3%" y="-7%" filterUnits="objectBoundingBox">
            <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="shadowSpreadOuter1"/>
            <feOffset dy="3" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3.5"/>
            <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
            <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
        </filter>
    </defs>
    <g fill="currentColor" fillRule="evenodd" transform="translate(-150 -380)">
        <path fill="#FBFBFB" d="M0 0h1280v951H0z"/>
        <path fill="#EEE" stroke="#CCC" d="M54 243h272a4 4 0 0 1 4 4v156H50V247a4 4 0 0 1 4-4z"/>
        <rect width="280" height="240" x="50" y="243" stroke="#373B44" rx="4"/>
        <g transform="translate(137 297)">
            <use fill="#000" filter="url(#a)" href="#b"/>
            <rect width="180" height="144" x="-.5" y="-.5" fill="#FFF" stroke="#CFCFCF" rx="4"/>
        </g>
        <path fill="#EBEBEB" d="M137 369h179v35H137z"/>
        <path fill="#373B44" d="M151.219 380.25v12.5c0 .138.112.25.25.25h4.469a.25.25 0 0 0 .25-.25v-.35a.25.25 0 0 0-.25-.25h-3.87v-11.3h5.57v3.046c0 .138.112.25.25.25h3.043v3.006c0 .138.112.25.25.25h.35a.25.25 0 0 0 .25-.25v-3.504a.25.25 0 0 0-.073-.176l-3.396-3.399a.25.25 0 0 0-.177-.073h-6.666a.25.25 0 0 0-.25.25zm7.269 1.202l1.842 1.844h-1.842v-1.844zm-1.103 8.891h3.42l-1.088-1.09a.135.135 0 0 1 0-.19l.44-.442a.136.136 0 0 1 .192 0l2.07 2.074a.136.136 0 0 1 0 .191l-2.07 2.074a.135.135 0 0 1-.19 0l-.442-.441a.135.135 0 0 1 0-.192l1.087-1.089h-3.419a.135.135 0 0 1-.135-.135v-.625c0-.075.06-.135.135-.135z"/>
    </g>
</svg>

);

export default SvgMoveDocument;

