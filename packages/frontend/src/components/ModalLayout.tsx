import React, { FC } from "react";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";
import { baseStyles, colors, DialogModal, DialogModalProps } from "@bitbloq/ui";
import SEO from "../components/SEO";

interface ModalLayoutProps extends DialogModalProps {
  title: string;
  modalTitle: string;
}

const ModalLayout: FC<ModalLayoutProps> = ({
  title,
  modalTitle,
  ...modalProps
}) => {
  return (
    <>
      <SEO title={title} keywords={[`bitbloq`]} />
      <Global styles={baseStyles} />
      <DialogModal
        {...modalProps}
        transparentOverlay={true}
        title={modalTitle}
        isOpen={true}
      />
    </>
  );
};

export default ModalLayout;
