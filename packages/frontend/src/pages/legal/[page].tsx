import React from "react";
import { NextPage } from "next";
import { useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import withApollo from "../../apollo/withApollo";
import LandingHeader from "../../components/LandingHeader";
import LandingFooter from "../../components/LandingFooter";
import Layout from "../../components/Layout";

interface ILegalPageProps {
  page: string;
}

const LegalPage: NextPage<ILegalPageProps> = ({ page }) => {
  const t = useTranslate();

  return (
    <>
      <LandingHeader fixed={true} />
      <Layout>
        <Header>{t(`legal.${page}`)}</Header>
        <Content dangerouslySetInnerHTML={{ __html: t(page) }} />
      </Layout>
      <LandingFooter />
    </>
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
`;

const Header = styled.h1`
  font-size: 30px;
  font-weight: 300;
  text-align: center;
  margin: 80px auto 40px auto;
  line-height: 1.2;
`;
