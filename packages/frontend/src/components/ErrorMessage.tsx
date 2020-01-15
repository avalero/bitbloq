import { colors } from "@bitbloq/ui";
import styled from "@emotion/styled";

const ErrorMessage = styled.div<{ hide?: boolean }>`
  color: ${colors.red};
  display: ${props => (props.hide ? "none" : "block")};
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
`;

export default ErrorMessage;
