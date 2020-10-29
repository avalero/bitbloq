import React, { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import { colors, Icon, useTranslate } from "@bitbloq/ui";

interface ICompilingAlertProps {
  compiling?: boolean;
  uploading?: boolean;
  visible?: boolean;
  compileSuccess?: boolean;
  compileError?: boolean;
  uploadSuccess?: boolean;
  uploadError?: boolean;
  onCancel?: () => void;
}

const CompilingAlert: FC<ICompilingAlertProps> = ({
  compiling,
  uploading,
  visible,
  compileSuccess,
  compileError,
  uploadSuccess,
  uploadError,
  onCancel
}) => {
  const t = useTranslate();
  const [show, setShow] = useState(false);
  const hideTimeout = useRef(0);

  useEffect(() => {
    if (visible) {
      setShow(true);
    } else {
      if (uploadError || uploadSuccess || compileError || compileSuccess) {
        hideTimeout.current = window.setTimeout(() => {
          setShow(false);
        }, 5000);
      } else {
        setShow(false);
      }
    }
  }, [visible]);

  useEffect(() => {
    if (!show && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = 0;
    }
  }, [show]);

  const onCloseClick = () => {
    if ((compiling || uploading) && onCancel) {
      onCancel();
    }
    setShow(false);
  };

  const message = compiling
    ? "compiling"
    : uploading
    ? "uploading"
    : compileSuccess
    ? "compile-success"
    : compileError
    ? "compile-error"
    : uploadSuccess
    ? "upload-success"
    : uploadError
    ? "upload-error"
    : "";

  return (
    <Container show={show}>
      <Message>
        {compiling || uploading ? (
          <Spinner name="spinner-small" />
        ) : compileSuccess || uploadSuccess ? (
          <OkIcon name="tick" />
        ) : compileError || uploadError ? (
          <ErrorIcon name="close" />
        ) : null}
        {message && t(`code.compiling-alert.${message}`)}
      </Message>
      <CloseButton onClick={onCloseClick}>
        <Icon name="close" />
      </CloseButton>
    </Container>
  );
};

export default CompilingAlert;

const Container = styled.div<{ show: boolean }>`
  position: absolute;
  height: 60px;
  display: flex;
  bottom: 20px;
  right: 20px;
  border-radius: 5px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.3);
  background-color: #ffffff;
  transition: transform 0.3s ease;
  transform: translate(0, ${props => (props.show ? 0 : 80)}px);
`;

const Message = styled.div`
  flex: 1;
  padding: 0 20px;
  display: flex;
  align-items: center;
  font-size: 14px;

  svg {
    margin-right: 6px;
  }
`;

const rotation = keyframes`
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
`;

const Spinner = styled(Icon)`
  animation: ${rotation} 2s ease infinite;
  margin-right: 6px;
`;

const OkIcon = styled(Icon)`
  color: ${colors.green};
`;

const ErrorIcon = styled(Icon)`
  color: ${colors.red};
`;

const CloseButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  color: ${colors.gray4};
  border-left: 1px solid ${colors.gray3};
  cursor: pointer;
`;
