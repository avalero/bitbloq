import * as React from "react";
import styled from "@emotion/styled";
import Icon from "./Icon";
import colors from "../colors";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  showHeader: boolean;
  onClose: () => void;
}

export default class Modal extends React.Component<ModalProps> {
  static defaultProps: Partial<ModalProps> = {
    isOpen: false,
    showHeader: true
  };

  render() {
    const { isOpen, title, onClose, children, showHeader } = this.props;

    if (!isOpen) return false;

    return (
      <Overlay onClick={onClose}>
        <Container onClick={e => e.stopPropagation()}>
          {showHeader && (
            <Header>
              <Title>{title}</Title>
              <Close onClick={onClose}>
                <Icon name="close" />
              </Close>
            </Header>
          )}
          <div>{children}</div>
        </Container>
      </Overlay>
    );
  }
}

/* styled components */

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 20;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  background-color: white;
`;

const Header = styled.div`
  display: flex;
  height: 60px;
  border-bottom: 1px solid ${colors.gray2};
`;

const Title = styled.div`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  display: flex;
  align-items: center;
  border-right: 1px solid ${colors.gray2};
`;

const Close = styled.div`
  color: ${colors.gray4};
  width: 60px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;
