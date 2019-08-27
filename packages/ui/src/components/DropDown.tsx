import React, { Component } from "react";
import TetherComponent from "react-tether";

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
    attachmentPosition: "top right",
    targetPosition: "bottom right"
  };

  toggleEl: HTMLElement | null;
  attachmentEl: HTMLElement | null;
  state = { isOpen: false };

  componentDidMount() {
    document.addEventListener("click", this.onBodyClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onBodyClick, false);
  }

  close() {
    this.setState({ isOpen: false });
  }

  onBodyClick = (e: MouseEvent) => {
    const { closeOnClick } = this.props;
    const toggle = this.toggleEl;
    const attachment = this.attachmentEl;

    if (toggle && toggle.contains(e.target as HTMLElement)) {
      this.setState(state => ({ ...state, isOpen: !state.isOpen }));
    } else if (attachment && attachment.contains(e.target as HTMLElement)) {
      if (closeOnClick) {
        this.setState({ isOpen: false });
      }
    } else {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const { isOpen } = this.state;
    const { attachmentPosition, targetPosition } = this.props;
    const [element, attachment] = this.props.children as Function[];

    return (
      <TetherComponent
        attachment={attachmentPosition}
        targetAttachment={targetPosition}
        style={{ zIndex: 20 }}
        renderTarget={(ref: React.MutableRefObject<HTMLElement | null>) => (
          <div
            ref={el => {
              ref.current = el;
              this.toggleEl = el;
            }}
          >
            {element(isOpen)}
          </div>
        )}
        renderElement={(ref: React.MutableRefObject<HTMLElement | null>) =>
          isOpen && (
            <div
              ref={el => {
                ref.current = el;
                this.attachmentEl = el;
              }}
            >
              {attachment}
            </div>
          )
        }
      />
    );
  }
}

export default DropDown;
