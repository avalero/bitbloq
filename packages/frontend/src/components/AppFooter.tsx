import React from "react";
import { colors, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { privacyPolicyUrl } from "../config";

const AppFooter = () => {
  const t = useTranslate();

  return (
    <Container>
      <a target="_blank" href="/legal/general-conditions">
        {t("legal-links.general-conditions")}
      </a>
      |
      <a target="_blank" href={privacyPolicyUrl}>
        {t("legal-links.privacy-policy")}
      </a>
      |
      <a target="_blank" href="/legal/cookies-policy">
        {t("legal-links.cookies-policy")}
      </a>
    </Container>
  );
};

export default AppFooter;

/* styled components */

const Container = styled.div`
  display: flex;
  min-height: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.grayFooter};
  color: ${colors.gray4};

  a {
    margin: 0px 10px;
    font-weight: bold;
    font-size: 14px;
    color: ${colors.gray4};
    text-decoration: none;
  }
`;
