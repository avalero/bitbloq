import React from "react";
import { NextPage } from "next";
import { colors, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import withApollo from "../../apollo/withApollo";
import LandingLayout from "../../components/LandingLayout";

interface ILegalPageProps {
  page: string;
}

const LegalPage: NextPage<ILegalPageProps> = ({ page }) => {
  const t = useTranslate();

  return (
    <LandingLayout headerFixed={true}>
      <Header>{t(`legal.${page}`)}</Header>
      <Content dangerouslySetInnerHTML={{ __html: t(page) }} />
    </LandingLayout>
  );
};

LegalPage.getInitialProps = async ({ query }) => {
  return {
    page: query.page.toString()
  };
};

export default withApollo(LegalPage, { requiresSession: false });

/* styled components */

const Content = styled.div`
  font-size: 14px;
  line-height: 22px;
  margin: 0 auto 80px auto;
  max-width: 980px;

  a {
    color: ${colors.brandBlue};
    font-style: italic;
    font-weight: bold;
    text-decoration: none;
  }

  td {
    background-color: ${colors.gray1};
    border: 1px solid white;
    padding: 10px;
    width: 40%;

    &:first-of-type {
      width: 20%;
    }
  }

  ul {
    padding-inline-start: 40px;
    list-style-type: disc;
  }
`;

const Header = styled.h1`
  font-size: 30px;
  font-weight: 300;
  text-align: center;
  margin: 80px auto 40px auto;
  line-height: 1.2;
`;
