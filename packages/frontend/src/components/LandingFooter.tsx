import React, { FC } from "react";
import styled from "@emotion/styled";
import AppFooter from "./AppFooter";
import Layout from "../components/Layout";
import bqLogo from "../images/bq-logo.svg";

const LandingFooter: FC = () => {
  return (
    <Container>
      <Main>
        {/* <Left>
            <h2>Contacto</h2>
            <p>Bq Educación</p>
            <p>900 00 00 00</p>
            <p>soporte.bitbloq@bq.com</p>
          </Left> */}
        <Right>
          <p>Bitbloq es un proyecto de:</p>
          <img src={bqLogo} alt="BQ" />
        </Right>
      </Main>
      <AppFooter />
    </Container>
  );
};

export default LandingFooter;

/* styled components */

const Container = styled.div`
  color: white;
  font-size: 14px;
  background-color: #5d6069;
`;

const Main = styled(Layout)`
  display: flex;
  padding: 40px 50px;
  justify-content: flex-end;
`;

const Left = styled.div`
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p {
    margin-top: 10px;
  }
`;

const Right = styled.div`
  display: flex;
  width: 480.56px;
  align-items: center;
  p {
    margin-right: 20px;
    white-space: nowrap;
  }
`;
