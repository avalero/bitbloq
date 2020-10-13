import styled from "@emotion/styled";

const BloqTextInput = styled.input`
  padding: 0 10px;
  border-radius: 4px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.24);
  background-color: rgba(0, 0, 0, 0.2);
  height: 26px;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding-right: 30px;
  position: relative;
  text-align: left;

  &:focus {
    outline: none;
  }
`;

export default BloqTextInput;
