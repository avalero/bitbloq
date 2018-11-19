import React, {Component} from 'react';
import TetherComponent from 'react-tether';
import styled, {css} from 'react-emotion';

const Container = styled.div`
  background-color: #373b44;
  border-radius: 2px;
  pointer-events: none;
  color: white;
  font-size: 12px;
  padding: 10px;
  text-align: center;
  margin-top: 16px;
  line-height: normal;
  max-width: 220px;

  i {
    color: #4dc3ff
  }

  &::before {
    content: '';
    background-color: #373b44;
    width: 8px;
    height: 8px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: 12px;
    left: 50%;

    ${props => props.position === 'right' && css`
      transform: translate(0, -50%) rotate(45deg);
      top: 50%;
      left: 12px;
    `}
  }

  ${props =>
    props.position === 'right' &&
    css`
      margin-top: 0px;
      margin-left: 16px
    `};
`;

export interface TooltipProps {
  content: JSX.Element;
  position: string;
}

interface State {
  isVisible: boolean;
}

const attachmentPostion = {
  top: 'bottom center',
  bottom: 'top center',
  left: 'middle right',
  right: 'middle left',
};

const targetPosition = {
  top: 'top center',
  bottom: 'bottom center',
  left: 'middle left',
  right: 'middle right',
};

class Tooltip extends Component<TooltipProps, State> {
  state = {isVisible: false};

  onMouseOver = () => {
    this.setState({isVisible: true});
  };

  onMouseOut = () => {
    this.setState({isVisible: false});
  };

  render() {
    const {isVisible} = this.state;
    const {children, content, position = 'bottom'} = this.props;
    const {onMouseOver, onMouseOut} = this;

    if (!content) {
      return children({});
    }

    return (
      <TetherComponent
        attachment={attachmentPostion[position]}
        targetAttachment={targetPosition[position]}
        style={{ zIndex: 20 }}
      >
        {children({onMouseOver, onMouseOut})}
        {isVisible && <Container position={position}>{content}</Container>}
      </TetherComponent>
    );
  }
}

export default Tooltip;
