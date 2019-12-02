import styled from "@emotion/styled";

const HeaderRightContent = styled.div<{ hideBorder?: boolean }>`
  align-items: center;
  border-left: ${props => (props.hideBorder ? "none" : "solid 1px #cfcfcf")};
  display: flex;
  height: 70px;
  margin-right: 20px;
  padding-left: 19px;
`;

export default HeaderRightContent;
