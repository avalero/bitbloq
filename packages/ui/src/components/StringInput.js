import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Icon from './Icon';
import Input from './Input';

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  border: 1px solid #cfcfcf;
  border-radius: 4px;

  ${props =>
    props.focused &&
    css`
      border: 1px solid #5d6069;
    `}
`;

const Button = styled.div`
  width: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DecrementButton = styled(Button)`
  border-radius: 4px 0px 0px 4px;
  border-right: 1px solid #cfcfcf;
  color: #8c919b;

  svg {
    transform: rotate(-90deg);
  }
`;

const IncrementButton = styled(Button)`
  border-radius: 0px 4px 4px 0px;
  border-left: 1px solid #cfcfcf;
  color: #8c919b;

  svg {
    transform: rotate(90deg);
  }
`;

const StyledInput = styled(Input)`
  border: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border: none;
  }
`;

const ValueText = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 13px;
  top: 0px;
  left: 32px;
  height: 33px;
  pointer-events: none;
`;

export default class StringInput extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();

    this.state = {
      focused: false,
      text: String(props.value) ? String(props.value) : '',
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { value } = this.props;
    const { focused, text } = this.state;
    const input = this.input.current;
    if (input && focused && !prevState.focused) {
      input.select();
    }

    const stringValue = String(text) || 0;
    if (value !== stringValue) {
      this.setState({
        text: String(value) ? String(value) : '',
      });
    }
  }

  onChange = e => {
    const { onChange } = this.props;

    this.setState({
      text: e.target.value,
    });

    if (onChange) {
      onChange(String(e.target.value) || 0);
    }
  };

  onFocus = e => {
    const { onFocus } = this.props;

    this.setState({ focused: true });

    if (onFocus) {
      onFocus(e);
    }
  };

  onBlur = e => {
    const { onBlur, value } = this.props;
    this.setState({
      focused: false,
      text: String(value) ? String(value) : '',
    });

    if (onBlur) {
      onBlur(e);
    }
  };

  render() {
    const { focused, text } = this.state;
    const { value } = this.props;

    return (
      <Container focused={focused}>
        <StyledInput
          {...this.props}
          ref={this.input}
          value={focused ? text : ''}
          onChange={this.onChange}
          type="text"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!focused && <ValueText>{value}</ValueText>}
      </Container>
    );
  }
}
