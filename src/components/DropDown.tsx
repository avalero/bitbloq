import React, { Component } from 'react';
import TetherComponent from 'react-tether';

export interface DropDownProps {}

interface State {
  isOpen: boolean;
}

class DropDown extends Component<DropDownProps, State> {
  toggleRef = React.createRef();
  state = { isOpen: false };

  componentDidMount() {
    document.addEventListener('click', this.onBodyClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBodyClick, false);
  }

  onBodyClick = (e) => {
    if (this.toggleRef.current.contains(e.target)) {
      this.setState(state => ({ ...state, isOpen: !state.isOpen }));
    } else {
      this.setState({ isOpen: false });
    }
  }

  render() {
    const { isOpen } = this.state;
    const [element, attachment] = this.props.children;

    return (
      <TetherComponent
        attachment="top right"
        targetAttachment="bottom right"
      >
        <div ref={this.toggleRef}>
          {element(isOpen)}
        </div>
        {isOpen && attachment}
      </TetherComponent>
    );
  }
}

export default DropDown;
