import React from 'react';
import styled, {css} from 'react-emotion';
import chroma from 'chroma-js';
import {TwitterPicker} from 'react-color';

const Container = styled.div`
  position: relative;
`;

const Square = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid white;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.color};
`;

const PickerWrap = styled.div`
  position: absolute;
  z-index: 2;
  ${props => props.position === 'top-left' && css`
    left: -9px;
  `}
  ${props => props.position === 'top-right' && css`
    right: -9px;
  `}
  top: 36px;
  display: ${props => props.open ? 'block' : 'none'};
`;

export default class ColorPicker extends React.Component {
  static defaultProps = {
    format: 'hex',
    position: 'top-left',
  };

  state = {open: false};

  onSquareClick = (e) => {
    this.setState(state => ({...state, open: !state.open}));
  };

  onColorChange = color => {
    const {onChange, format} = this.props;
    if (onChange) {
      this.setState(state => ({...state, open: !state.open}));
      if (format === 'number') {
        onChange(chroma(color.hex).num());
      } else {
        onChange(color.hex);
      }
    }
  };

  onContainerClick = (e) => {
    e.stopPropagation();
  };

  render() {
    const {open} = this.state;
    const {color = '#fff', className, position} = this.props;
    const colorHex = chroma(color).hex();
    return (
      <Container className={className} onClick={this.onContainerClick}>
        <Square color={colorHex} onClick={this.onSquareClick} />
        <PickerWrap open={open} position={position}>
          <TwitterPicker
            triangle={position}
            color={colorHex}
            onChangeComplete={this.onColorChange}
          />
        </PickerWrap>
      </Container>
    );
  }
}
