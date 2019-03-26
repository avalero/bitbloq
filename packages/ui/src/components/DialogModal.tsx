import * as React from "react";
import styled from "@emotion/styled";
import Button from "./Button";
import Modal from "./Modal";
import colors from "../colors";

interface DialogModalProps {
  isOpen: boolean;
  title?: string;
  text?: string;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
}

const DialogModal: React.SFC<DialogModalProps> = ({
  isOpen,
  title,
  text,
  okText,
  cancelText,
  onOk,
  onCancel
}) => (
  <Modal isOpen={isOpen} showHeader={false} onClose={onCancel}>
    <Content>
      <h2>{title}</h2>
      <p>{text}</p>
      {okText && <Button onClick={onOk}>{okText}</Button>}
      {cancelText && (
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

  ${Button} {
    width: 100%;
    text-align: center;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0px;
    }
  }
`;
