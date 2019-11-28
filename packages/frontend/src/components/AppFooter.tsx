import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";

const AppFooter = () => {
  return (
    <Container>
      <a href="#" target="_blank">
        Condiciones generales
      </a>
      |
      <a href="#" target="_blank">
        Política de Privacidad
      </a>
      |
      <a href="#" target="_blank">
        Política de cookies
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
