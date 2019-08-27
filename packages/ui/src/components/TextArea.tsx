import styled from "@emotion/styled";
import Input from "./Input";

const TextArea = styled(Input.withComponent("textarea"))`
  height: auto;
  min-height: 35px;
  padding: 8px 12px;
  resize: none;
`;

/** @component */
export default TextArea;
