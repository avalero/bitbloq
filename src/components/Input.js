import React from 'react';
import styled from 'react-emotion';

const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 6px;
  flex: 1;
  height: 18px;
  padding: 6px 12px;
  width: 100%;

  &:focus {
    outline: none;
    border: 1px solid #2684ff;
    box-shadow: 0 0 0 1px #2684ff;
  }
`;

export default Input;
