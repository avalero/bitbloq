import React from 'react';
import styled, {css} from 'react-emotion';
import Input from './Input';
import ArrowIcon from './icons/Arrow';

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
  input = React.createRef();

  state = {
    focused: false
  };

  componentDidUpdate(prevProps, prevState) {
    const {focused} = this.state;
    const input = this.input.current;
    if (input && focused && !prevState.focused) {
      input.select();
    }
  }

  onChange = e => {
    const {onChange} = this.props;

    if (onChange) {
      onChange(Number(e.target.value));
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
    const {onBlur} = this.props;
    this.setState({ focused: false });

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
    const {focused} = this.state;
    const {value, unit} = this.props;

    return (
      <Container focused={focused}>
        <DecrementButton onClick={this.onDecrementClick}>
          <ArrowIcon />
        </DecrementButton>
        <StyledInput
          {...this.props}
          innerRef={this.input}
          value={focused ? value : ''}
          onChange={this.onChange}
          type="number"
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        {!focused &&
          <ValueText>{value} {unit}</ValueText>
        }
        <IncrementButton onClick={this.onIncrementClick}>
          <ArrowIcon />
        </IncrementButton>
      </Container>
    );
  }
}
