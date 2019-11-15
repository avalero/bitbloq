import React, { Component } from "react";
import TetherComponent from "react-tether";

export interface IDropDownProps {
  className?: string;
  closeOnClick?: boolean;
  attachmentPosition: string;
  targetPosition: string;
  constraints?: Array<{
    attachment?: string;
    outOfBoundsClass?: string;
    pin?: boolean | string[];
    pinnedClass?: string;
    to?: string | HTMLElement;
  }>;
  notHidden?: boolean;
  offset?: string;
  targetOffset?: string;
  children: [(isOpen: boolean) => JSX.Element, JSX.Element];
}

interface IState {
  isOpen: boolean;
}

class DropDown extends Component<IDropDownProps, IState> {
  public static defaultProps = {
    closeOnClick: true,
    attachmentPosition: "top right",
    targetPosition: "bottom right"
  };
  public state = { isOpen: false };

  private toggleEl: HTMLElement | null;
  private attachmentEl: HTMLElement | null;

  public componentDidMount() {
    document.addEventListener("click", this.onBodyClick, false);
  }

  public componentWillUnmount() {
    document.removeEventListener("click", this.onBodyClick, false);
  }

  public close() {
    this.setState({ isOpen: false });
  }

  public render() {
    const { isOpen } = this.state;
    const {
      className,
      constraints,
      offset,
      attachmentPosition,
      notHidden,
      targetPosition,
      targetOffset
    } = this.props;
    const [element, attachment] = this.props.children;

    return (
      <TetherComponent
        className={className}
        constraints={constraints}
        attachment={attachmentPosition}
        targetAttachment={targetPosition}
        style={{ zIndex: 21 }}
        offset={offset || "0 0"}
        targetOffset={targetOffset || "0 0"}
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
        renderElement={(ref: React.MutableRefObject<HTMLElement | null>) => (
          <div
            style={{ display: isOpen || notHidden ? "block" : "none" }}
            ref={el => {
              ref.current = el;
              this.attachmentEl = el;
            }}
          >
            {attachment}
          </div>
        )}
      />
    );
  }

  private onBodyClick = (e: MouseEvent) => {
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
}

export default DropDown;
