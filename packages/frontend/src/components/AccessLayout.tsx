import React, { FC } from "react";
import { Global, css } from "@emotion/core";
import {
  baseStyles,
  colors,
  Input,
  Panel,
  Button,
  HorizontalRule
} from "@bitbloq/ui";
import SEO from "../components/SEO";

export enum AccessLayoutSize {
  SMALL,
  MEDIUM,
  BIG
}

interface AccessLayoutProps {
  title: string;
  size?: AccessLayoutSize;
}

const AccessLayout: FC<AccessLayoutProps> = ({ title, size, children }) => {
  return (
    <>
      <SEO title={title} keywords={[`bitbloq login`]} />
      <Global styles={baseStyles} />
    </>
  );
};

AccessLayout.defaultProps = {
  size: AccessLayoutSize.SMALL
};

export default AccessLayout;
