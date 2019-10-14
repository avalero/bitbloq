import * as React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";

const AppFooter = () => {
  return (
    <Container>
      <Links>
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
      </Links>
    </Container>
  );
};

export default AppFooter;

/* styled components */

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 54px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: ${colors.grayFooter};
`;

const Links = styled.div`
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray4};
  a {
    margin: 0px 10px;
    font-weight: bold;
    color: ${colors.gray4};
    text-decoration: none;
    :hover {
      cursor: pointer;
    }
  }
`;
