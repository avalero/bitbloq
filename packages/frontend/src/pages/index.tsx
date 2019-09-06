import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { navigate, Link } from "gatsby";
import { Global, css } from "@emotion/core";
import {
  baseStyles,
  colors,
  Input,
  Button,
  Icon,
  DropDown,
  HorizontalRule
} from "@bitbloq/ui";
import { useQuery } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";
import SEO from "../components/SEO";
import NewDocumentDropDown from "../components/NewDocumentDropDown";
import logoBetaImage from "../images/logo-beta.svg";
import { documentTypes } from "../config";
import bqLogo from "../images/bq-logo.svg";
import studentStep1Image from "../images/student-step-1.svg";
import studentStep2Image from "../images/student-step-2.svg";
import heroImage from "../images/home_beta-decoration.svg";

const IndexPage: FC = () => {
  const { data } = useQuery(ME_QUERY, {
    context: { disableAuthRedirect: true }
  });

  const [exerciseCode, setExerciseCode] = useState("");

  if (data && data.me) {
    navigate("/app");
  }

  const onNewDocument = (type: string) => {
    navigate(`/app/playground/${type}`);
  };

  const onOpenDocument = () => {};

  const onOpenExercise = () => {
    if (exerciseCode) {
      console.log(exerciseCode);
    }
  };

  return (
    <>
      <SEO title="Home" keywords={[`bitbloq`]} />
      <Global styles={baseStyles} />
      <Container>
        <Header>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
            closeOnClick={false}
          >
            {(isOpen: boolean) => <Button tertiary>Ir al ejercicio</Button>}
            <ExerciseDropDown>
              <ExerciseForm>
                <label>Código del ejercicio</label>
                <Input
                  type="text"
                  placeholder="Código del ejercicio"
                  value={exerciseCode}
                  onChange={e => setExerciseCode(e.target.value)}
                />
                <Button onClick={() => onOpenExercise()}>Ir a ejercicio</Button>
              </ExerciseForm>
            </ExerciseDropDown>
          </DropDown>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
          >
            {(isOpen: boolean) => <Button tertiary>Nuevo documento</Button>}

            <NewDocumentDropDown
              onNewDocument={onNewDocument}
              onOpenDocument={onOpenDocument}
            />
          </DropDown>
          <Button onClick={() => navigate("/login")}>Entrar</Button>
          <Button secondary onClick={() => navigate("/signup")}>
            Crear una cuenta
          </Button>
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
                  {type.supported && (
                    <Button
                      {...{ [type.buttonType]: true }}
                      onClick={() => onNewDocument(type.id)}
                    >
                      <PlusIcon>
                        <Icon name="plus" />
                      </PlusIcon>
                      Nuevo documento
                    </Button>
                  )}
                  {!type.supported && <ComingSoon>Próximamente</ComingSoon>}
                </Tool>
              ))}
          </ToolsList>
        </Container>
      </Tools>
      <OpenExercise>
        <Container>
          <OpenExerciseWrap>
            <OpenExerciseInfo>
              <h2>
                <Icon name="airplane-document" />
                Ir a un ejercicio
              </h2>
              <OpenExerciseSteps>
                <OpenExerciseStep>
                  <img src={studentStep1Image} />
                  <p>
                    1. Pide a tu profesor el código del ejercicio que quieres
                    hacer.
                  </p>
                </OpenExerciseStep>
                <OpenExerciseStep>
                  <img src={studentStep2Image} />
                  <p>2. Introduce el código y pulsa en “Empezar”.</p>
                </OpenExerciseStep>
              </OpenExerciseSteps>
            </OpenExerciseInfo>
            <OpenExercisePanel>
              <OpenExercisePanelTitle>Ir a ejercicio</OpenExercisePanelTitle>
              <HorizontalRule small />
              <OpenExercisePanelContent>
                <ExerciseForm>
                  <label>Código del ejercicio</label>
                  <Input
                    type="text"
                    placeholder="Código del ejercicio"
                    value={exerciseCode}
                    onChange={e => setExerciseCode(e.target.value)}
                  />
                  <Button onClick={() => onOpenExercise()}>Empezar</Button>
                </ExerciseForm>
              </OpenExercisePanelContent>
            </OpenExercisePanel>
          </OpenExerciseWrap>
        </Container>
      </OpenExercise>
      <Footer>
        <MainFooter>
          <FooterContainer>
            <FooterLeft>
              <h2>Contacto</h2>
              <p>Bq Educación</p>
              <p>900 00 00 00</p>
              <p>soporte.bitbloq@bq.com</p>
            </FooterLeft>
            <FooterRight>
              <p>Bitbloq es un proyecto de:</p>
              <img src={bqLogo} alt="BQ" />
            </FooterRight>
          </FooterContainer>
        </MainFooter>
        <LegalLinks>
          <Link to="#">Condiciones generales</Link>
          {" | "}
          <Link to="#">Política de privacidad</Link>
          {" | "}
          <Link to="#">Política de cookies</Link>
        </LegalLinks>
      </Footer>
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

const ExerciseDropDown = styled.div`
  width: 280px;
  margin-top: 8px;
  background-color: white;
  border-radius: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  padding: 20px;

  &::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: -10px;
    left: 50%;
  }
`;

const ExerciseForm = styled.div`
  label {
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  }

  input {
    margin-bottom: 30px;
  }

  button {
    width: 100%;
  }
`;

const Hero = styled.div`
  padding: 0px 50px;
  box-sizing: border-box;
  background-color: #f1f1f1;
  background-image: url(${heroImage});
  background-repeat: no-repeat;
  background-position: right center;
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

const OpenExercise = styled.div``;

const OpenExerciseWrap = styled.div`
  width: 83.33%;
  display: flex;
  margin: 80px 0px 80px 8.33%;
`;

const OpenExerciseInfo = styled.div`
  margin-bottom: 40px;
  width: 66%;

  h2 {
    display: flex;
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

const OpenExerciseSteps = styled.div`
  display: flex;
`;

const OpenExerciseStep = styled.div`
  display: flex;
  flex: 1;
  padding-right: 20px;
  box-sizing: border-box;
  img {
    width: 80px;
    height: 80px;
    margin-right: 10px;
  }
  p {
    font-size: 14px;
    line-height: 1.57;
  }
`;

const OpenExercisePanel = styled.div`
  border-radius: 10px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 33%;
`;

const OpenExercisePanelTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  font-size: 18px;
  font-weight: bold;
`;

const OpenExercisePanelContent = styled.div`
  padding: 30px;
`;

const Footer = styled.div`
  color: white;
  font-size: 14px;
`;

const MainFooter = styled.div`
  background-color: #5d6069;
`;

const FooterContainer = styled(Container)`
  display: flex;
  padding: 40px 50px;
`;

const FooterLeft = styled.div`
  flex: 1;
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p {
    margin-top: 10px;
  }
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: 20px;
  }
`;

const LegalLinks = styled.div`
  background-color: #373b44;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8c919b;

  a {
    color: #8c919b;
    margin: 0px 10px;
    font-weight: bold;
    text-decoration: none;
  }
`;
