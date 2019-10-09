import * as React from "react";
import styled from "@emotion/styled";
import Button from "./Button";
import Modal from "./Modal";
import colors from "../colors";

export interface DialogModalProps {
  isOpen: boolean;
  title?: string;
  text?: string;
  content?: JSX.Element;
  okText?: string;
  cancelText?: string;
  okButton?: JSX.Element;
  cancelButton?: JSX.Element;
  onOk: () => void;
  onCancel?: () => void;
  transparentOverlay?: boolean;
}

const DialogModal: React.SFC<DialogModalProps> = ({
  isOpen,
  title,
  text,
  content,
  okText,
  cancelText,
  okButton,
  cancelButton,
  onOk,
  onCancel,
  transparentOverlay
}) => (
  <Modal
    isOpen={isOpen}
    showHeader={false}
    transparentOverlay={transparentOverlay}
  >
    <Content>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {content}
      {okButton}
      {!okButton && okText && <Button onClick={onOk}>{okText}</Button>}
      {cancelButton}
      {!cancelButton && cancelText && (
        <Button tertiary onClick={onCancel}>
          {cancelText}
        </Button>
      )}
    </Content>
  </Modal>
);

export default DialogModal;

/* styled-components */

const Content = styled.div`
  padding: 30px;
  width: 400px;
  text-align: center;
  box-sizing: border-box;
  color: ${colors.blackHover};

  h2 {
    font-size: 18px;
    font-weight: bold;
    margin: 0px 0px 40px 0px;
  }

  p {
    font-size: 14px;
    line-height: 22px;
    margin: 0px 0px 40px 0px;
  }

  a {
    color: #00ade5;
    text-decoration: none;
    font-style: italic;
    font-weight: bold;
  }

  & > ${Button} {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0px;
    }
  }
`;
