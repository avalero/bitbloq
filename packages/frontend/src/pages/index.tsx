import React, { FC } from "react";
import styled from "@emotion/styled";
import { navigate, Link } from "gatsby";
import { Global, css } from "@emotion/core";
import { baseStyles, colors, Input, Button, Icon } from "@bitbloq/ui";
import SEO from "../components/SEO";
import logoBetaImage from "../images/logo-beta.svg";
import { documentTypes } from "../config";
import studentStep1Image from "../images/student-step-1.svg";
import studentStep2Image from "../images/student-step-2.svg";

const IndexPage: FC = () => {
  return (
    <>
      <SEO title="Home" keywords={[`bitbloq`]} />
      <Global styles={baseStyles} />
      <Container>
        <Header>
          <Button tertiary>Ir al ejercicio</Button>
          <Button tertiary>Nuevo documento</Button>
          <Button>Entrar</Button>
          <Button secondary>Crear una cuenta</Button>
        </Header>
        <Hero>
          <h1>
            <img src={logoBetaImage} alt="Bitbloq Beta" />
          </h1>
          <p>
            La plataforma más completa para trabajar el diseño 3D, la
            programación y la robótica en el aula.
          </p>
        </Hero>
      </Container>
      <Tools>
        <Container>
          <h2>
            <Icon name="new-document" />
            Crea o abre un documento
          </h2>
          <ToolsList>
            {Object.keys(documentTypes)
              .map(id => ({ ...documentTypes[id], id }))
              .map(type => (
                <Tool key={type.id}>
                  <ToolIcon color={type.color}>
                    <Icon name={type.icon} />
                  </ToolIcon>
                  <h3>{type.label}</h3>
                  <ToolLevel>{type.level}</ToolLevel>
                  <p>{type.landingText}</p>
                  {type.supported &&
                    <Button {...{[type.buttonType]: true}}>
                      <PlusIcon>
                        <Icon name="plus" />
                      </PlusIcon>
                      Nuevo documento
                    </Button>
                  }
                  {!type.supported &&
                    <ComingSoon>Próximamente</ComingSoon>
                  }
                </Tool>
              ))}
          </ToolsList>
        </Container>
      </Tools>
      <OpenExercise>
        <Container>
          <OpenExerciseWrap>
            <h2><Icon name="airplane-document" />Ir a un ejercicio</h2>
          </OpenExerciseWrap>
        </Container>
      </OpenExercise>
    </>
  );
};

export default IndexPage;

/* Styled components */

const Container = styled.div`
  max-width: 1280px;
  box-sizing: border-box;
  margin: 0px auto;
  padding: 0px 50px;
`;

const Header = styled.div`
  padding: 30px 0px 20px 0px;
  display: flex;
  justify-content: flex-end;
  button {
    margin-left: 10px;
  }
`;

const Hero = styled.div`
  padding: 0px 50px;
  box-sizing: border-box;
  background-color: #f1f1f1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  img {
    height: 90px;
    margin-bottom: 30px;
    margin-top: 125px;
  }

  p {
    font-size: 22px;
    font-weight: 300;
    line-height: 1.36;
    margin-bottom: 125px;
    max-width: 512px;
  }
`;

const Tools = styled.div`
  border-bottom: 1px solid #e0e0e0;
  margin-top: 60px;
  h2 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    font-weight: 300;
    margin-bottom: 40px;

    svg {
      height: 36px;
      margin-right: 10px;
    }
  }
`;

const ToolsList = styled.div`
  display: flex;
  width: 83.33%;
  margin-left: 8.33%;
  flex-wrap: wrap;
`;

const Tool = styled.div`
  width: 33%;
  box-sizing: border-box;
  padding: 0px 5px;
  margin-bottom: 60px;

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    line-height: 1.57;
    margin-bottom: 20px;
  }
`;

interface ToolIconProps {
  color: string;
}
const ToolIcon = styled.div<ToolIconProps>`
  width: 60px;
  height: 60px;
  border-radius: 4px;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;

  svg {
    width: 40px;
  }
`;

const ToolLevel = styled.div`
  border: solid 1px #373b44;
  margin-bottom: 10px;
  padding: 0px 6px;
  font-weight: 300;
  font-size: 12px;
  height: 20px;
  display: inline-flex;
  text-transform: uppercase;
  align-items: center;
`;

const PlusIcon = styled.div`
  svg {
    margin-right: 6px;
    width: 16px;
    height: 16px;
  }
`;

const ComingSoon = styled.div`
  height: 40px;
  border-radius: 4px;
  background-color: #5d6069;
  display: inline-flex;
  align-items: center;
  padding: 0px 26px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-transform: uppercase;
`;

const OpenExercise = styled.div`
`;

const OpenExerciseWrap = styled.div`
  width: 83.33%;
  margin-left: 8.33%;

  h2 {
    margin: 80px 0px 40px 0px;
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: 300;

    svg {
      height: 36px;
      margin-right: 10px;
    }
  }
`
