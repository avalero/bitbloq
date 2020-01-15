import styled from "@emotion/styled";
import { breakpoints } from "@bitbloq/ui";

const HeaderRightContent = styled.div<{ hideBorder?: boolean }>`
  align-items: center;
  border-left: ${props => (props.hideBorder ? "none" : "solid 1px #cfcfcf")};
  display: flex;
  height: 50px;
  margin-right: 20px;
  padding-left: 19px;

  button {
    height: 36px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 70px;

    button {
      height: 40px;
    }
  }
`;

export default HeaderRightContent;
