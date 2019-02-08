import React, {Component} from 'react';
import TetherComponent from 'react-tether';

export interface DropDownProps {
  closeOnClick?: boolean;
  attachmentPosition: string;
  targetPosition: string;
}

interface State {
  isOpen: boolean;
}

class DropDown extends Component<DropDownProps, State> {
  static defaultProps = {
    closeOnClick: true,
    attachmentPosition: 'top right',
    targetPosition: 'bottom right',
  };

  toggleRef = React.createRef();
  attachmentRef = React.createRef();
  state = {isOpen: false};

  componentDidMount() {
    document.addEventListener('click', this.onBodyClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onBodyClick, false);
  }

  close() {
    this.setState({isOpen: false});
  }

  onBodyClick = e => {
    const {closeOnClick} = this.props;
    const toggle = this.toggleRef.current;
    const attachment = this.attachmentRef.current;

    if (toggle.contains(e.target)) {
      this.setState(state => ({...state, isOpen: !state.isOpen}));
    } else if (attachment && attachment.contains(e.target)) {
      if (closeOnClick) {
        this.setState({isOpen: false});
      }
    } else {
      this.setState({isOpen: false});
    }
  };

  render() {
    const {isOpen} = this.state;
    const {attachmentPosition, targetPosition} = this.props;
    const [element, attachment] = this.props.children;

    console.log('Render Dropdown')

    return (
      <TetherComponent
        attachment={attachmentPosition}
        targetAttachment={targetPosition}
        style={{ zIndex: 20 }}
        renderTarget={ref => (
          <div ref={el => {
            ref.current = el;
            this.toggleRef.current = el;
          }}>{element(isOpen)}</div>
        )}
        renderElement={ref =>
          isOpen && <div ref={el => {
            ref.current = el;
            this.attachmentRef.current = el;
          }}>{attachment}</div>
        }
      />
    );
  }
}

export default DropDown;
