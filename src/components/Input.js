import React from 'react';
import styled from 'react-emotion';

const Input = styled.input`
  border: 1px solid #cfcfcf;
  border-radius: 2px;
  flex: 1;
  height: 21px;
  padding: 6px 12px;
  width: 100%;
  font-size: 13px;

  &:focus {
    outline: none;
    border: 1px solid #5d6069;
  }
`;

export default Input;
