import * as React from 'react';
import styled, {css} from 'react-emotion';
import {Icon} from '@bitbloq/ui';

interface ContainerProps {
  checked: boolean;
}

const Container =
  styled.div <
  ContainerProps >
  `
  border-radius: 3px;
  width: 14px;
  height: 14px;
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: #c0c3c9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  ${props =>
    props.checked &&
    css`
      border-color: #5d6069;
      background-color: #5d6069;
      color: white;
    `} &:hover {
    border-color: #5d6069;
  }
`;

type ChangeHandler = (cheked: boolean) => void;

export interface CheckboxProps {
  className: string;
  checked: boolean;
  onChange: ChangeHandler;
}

export default class Checkbox extends React.Component<CheckboxProps> {
  render() {
    const {className, checked, onChange} = this.props;
    return (
      <Container
        className={className}
        checked={checked}
        onClick={() => onChange(!checked)}>
        {checked && <Icon name="tick" />}
      </Container>
    );
  }
}
