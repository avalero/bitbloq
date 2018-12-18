import React from 'react';
import styled from '@emotion/styled';

const Input = styled.input`
  border: 1px solid #cfcfcf;
  border-radius: 4px;
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

/** @component */
export default Input;
