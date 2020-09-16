import React, { FC } from "react";
import { colors, useTranslate, Layout } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { privacyPolicyUrl } from "../config";

const AppFooter: FC = ({ children }) => {
  const t = useTranslate();

  return (
    <Footer>
      <Layout>{children}</Layout>
      <LegalLinks>
        <a target="_blank" href="/legal/general-conditions">
          {t("legal.general-conditions")}
        </a>
        |
        <a target="_blank" href={privacyPolicyUrl} rel="noreferrer">
          {t("legal.privacy-policy")}
        </a>
        |
        <a target="_blank" href="/legal/cookies-policy">
          {t("legal.cookies-policy")}
        </a>
      </LegalLinks>
    </Footer>
  );
};

export default AppFooter;

/* styled components */

const Footer = styled.div`
  color: white;
  font-size: 14px;
  background-color: ${colors.gray5};
`;

const LegalLinks = styled.div`
  display: flex;
  min-height: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.black};
  color: ${colors.gray4};

  a {
    margin: 0px 10px;
    font-weight: bold;
    color: ${colors.gray4};
    text-decoration: none;
  }
`;
