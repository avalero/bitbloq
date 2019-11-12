import { FC } from "react";
import styled from "@emotion/styled";
import { colors, Spinner } from "@bitbloq/ui";

export interface ILoadingProps {
  color?: string;
}
const Loading: FC<ILoadingProps> = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: ${props => (props.color ? "white" : colors.black)};
  background-color: ${props => props.color};
`;

export default Loading;
