import React from 'react';
import styled from 'react-emotion';
import Input from './Input';

export default class NumberInput extends React.Component {
  onFocus = (e) => {
    const {onFocus} = this.props;
    e.target.select();
    if (onFocus) {
      onFocus(e);
    }
  };

  render() {
    return <Input
      {...this.props}
      type="number"
      onFocus={this.onFocus}
    />;
  }
}
