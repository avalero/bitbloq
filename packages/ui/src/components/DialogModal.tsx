import React, { SFC, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import Button from "./Button";
import Modal from "./Modal";
import HorizontalRule from "./HorizontalRule";
import colors from "../colors";

export interface IDialogModalProps {
  isOpen: boolean;
  title?: string;
  text?: JSX.Element | string;
  content?: JSX.Element;
  okText?: string;
  cancelText?: string;
  okButton?: JSX.Element;
  cancelButton?: JSX.Element;
  onOk?: () => void;
  onCancel?: () => void;
  transparentOverlay?: boolean;
  horizontalRule?: boolean;
}

const DialogModal: SFC<IDialogModalProps> = ({
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
  transparentOverlay,
  horizontalRule = false
}) => {
  const submitRef = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    const onSubmitForm = (e: KeyboardEvent) => {
      if (e.keyCode === 13 && submitRef.current) {
        e.preventDefault();
        submitRef.current.click();
      }
    };
    window.addEventListener("keypress", onSubmitForm);
    return () => window.removeEventListener("keypress", onSubmitForm);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      showHeader={false}
      transparentOverlay={transparentOverlay}
    >
      <Content>
        <Header horizontalRule={horizontalRule}>
          <h2>{title}</h2>
          {horizontalRule && <Rule small />}
        </Header>
        {text && <p>{text}</p>}
        {content}
        {okButton}
        {!okButton && okText && (
          <Button ref={submitRef} onClick={onOk}>
            {okText}
          </Button>
        )}
        {cancelButton}
        {!cancelButton && cancelText && (
          <Button tertiary onClick={onCancel}>
            {cancelText}
          </Button>
        )}
      </Content>
    </Modal>
  );
};

export default DialogModal;

/* styled-components */

const Content = styled.div`
  padding: 40px 30px 30px;
  width: 400px;
  text-align: center;
  box-sizing: border-box;
  color: ${colors.blackHover};

  h2 {
    height: 20px;
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

const Header = styled.div<{ horizontalRule: boolean }>`
  height: 60px;
  margin-bottom: ${props => (props.horizontalRule ? 40 : 0)}px;
  position: relative;
`;

const Rule = styled(HorizontalRule)`
  left: -30px;
  position: absolute;
  width: calc(100% + 60px);
`;
