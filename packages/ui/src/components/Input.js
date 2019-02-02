import styled from '@emotion/styled';
import { css } from '@emotion/core';
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

  ${props => props.error && css`
    box-shadow: 0 0 2px 2px rgba(255, 51, 51, 0.7);
    background-color: #ffd6d6;
    border: 1px solid white;
    color: #d82b32;

    &::placeholder {
      color: #d82b32;
    }
  `}
`;

/** @component */
export default Input;
