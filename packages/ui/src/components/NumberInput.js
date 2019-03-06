import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import Icon from './Icon';
import Input from './Input';

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  border: 1px solid #cfcfcf;
  border-radius: 4px;

  ${props => props.focused && css`
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

export default class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();

    this.state = {
      focused: false,
      text: Number(props.value) ? Number(props.value).toString() : ''
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {value} = this.props;
    const {focused, text} = this.state;
    const input = this.input.current;
    if (input && focused && !prevState.focused) {
      input.select();
    }

    const numberValue = Number(text) || 0;
    if (value !== numberValue) {
      this.setState({
        text: Number(value) ? Number(value).toString() : ''
      });
    }
  }

  onChange = e => {
    const {onChange} = this.props;

    this.setState({
      text: e.target.value
    });

    if (onChange) {
      onChange(Number(e.target.value) || 0);
    }
  };

  onFocus = (e) => {
    const {onFocus} = this.props;

    this.setState({ focused: true });

    if (onFocus) {
      onFocus(e);
    }
  };

  onBlur = (e) => {
    const {onBlur, value} = this.props;
    this.setState({
      focused: false,
      text: Number(value) ? Number(value).toString() : ''
    });

    if (onBlur) {
      onBlur(e);
    }
  }

  onDecrementClick = () => {
    const {value, onChange} = this.props;
    if (onChange) {
      onChange(Number(value) - 1)
    }
  }

  onIncrementClick = () => {
    const {value, onChange} = this.props;
    if (onChange) {
      onChange(Number(value) + 1)
    }
  }

  render() {
    const {focused, text} = this.state;
    const {value, unit} = this.props;

    return (
      <Container focused={focused}>
        <DecrementButton onClick={this.onDecrementClick}>
          <Icon name="arrow" />
        </DecrementButton>
        <StyledInput
          {...this.props}
          ref={this.input}
          value={focused ? text : ''}
          onChange={this.onChange}
          type="number"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!focused &&
          <ValueText>{value} {unit}</ValueText>
        }
        <IncrementButton onClick={this.onIncrementClick}>
          <Icon name="arrow" />
        </IncrementButton>
      </Container>
    );
  }
}
