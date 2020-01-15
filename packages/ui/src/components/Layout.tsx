import styled from "@emotion/styled";
import breakpoints from "../breakpoints";

const Layout = styled.div`
  max-width: ${breakpoints.desktop}px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 50px;
  width: 100%;
`;

/** @component */
export default Layout;
