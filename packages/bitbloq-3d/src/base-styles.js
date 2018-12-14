import { injectGlobal } from 'emotion';

export const colors = {
  black: '#373b44',
  brand: '#6a8d2f',
  yellow: '#e6b319', // hsl(45, 80%, 50%)
  red: '#e6193c', // hsl(350, 80%, 50%)
  green: '#5bbf40',
  blue: '#19a5e6'
};

export const shadow = 'box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);';

injectGlobal`
  body {
    font-family: 'Roboto', sans-serif;
    color: ${colors.black};
  }

  /* Style reset */
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    vertical-align: baseline;
  }
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  input {
    font-family: 'Roboto', sans-serif;
    color: ${colors.black}
  }
`;

