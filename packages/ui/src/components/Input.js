import styled from '@emotion/styled';
import colors from '../colors';

const Input = styled.input`
  border: 1px solid #cfcfcf;
  box-sizing: border-box;
  border-radius: 4px;
  flex: 1;
  height: 35px;
  padding: 6px 12px;
  width: 100%;
  font-size: 13px;

  &:focus {
    outline: none;
    border: 1px solid #5d6069;
  }

  &::placeholder {
    font-style: italic;
    color: #8c919b;
  }

  &[disabled] {
    color: ${colors.disabledColor};
    background-color: ${colors.disabledBackground};
    cursor: not-allowed;
  }
`;

/** @component */
export default Input;
