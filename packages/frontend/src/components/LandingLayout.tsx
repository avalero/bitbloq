import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, useRef, useState, useEffect } from "react";
import { useTranslate, DropDown, Icon, Button } from "@bitbloq/ui";
import styled from "@emotion/styled";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import Layout from "./Layout";
import NewDocumentButton from "./NewDocumentButton";
import OpenExerciseForm from "./OpenExerciseForm";
import bqLogo from "../images/bq-logo.svg";

export interface ILandingLayoutProps {
  headerFixed?: boolean;
}

const LandingLayout: FC<ILandingLayoutProps> = ({ headerFixed, children }) => {
  const router = useRouter();
  const t = useTranslate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  useEffect(() => {
    if (!headerFixed) {
      const handleScroll = () =>
        setIsHeaderSticky(
          headerRef.current !== null
            ? headerRef.current.getBoundingClientRect().top < -10
            : false
        );

      document.addEventListener("scroll", handleScroll);
      return () => document.removeEventListener("scroll", handleScroll);
    }

    return undefined;
  }, []);

  return (
    <>
      <div ref={headerRef}>
        <AppHeader isSticky={headerFixed ? undefined : isHeaderSticky}>
          <MainNavigation>
            <Link href="/plans">
              <NavLink active={router.pathname === "/plans"}>
                {t("plans.link")}
              </NavLink>
            </Link>
          </MainNavigation>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
            closeOnClick={false}
          >
            {(isOpen: boolean) => (
              <HeaderButton tertiary>
                <Icon name="airplane-document" />
                {t("documents.go-to-exercise")}
              </HeaderButton>
            )}
            <ExerciseDropDown>
              <OpenExerciseForm />
            </ExerciseDropDown>
          </DropDown>
          <NewDocumentButton />
          <HeaderButton onClick={() => router.push("/login")}>
            Entrar
          </HeaderButton>
          <HeaderButton secondary onClick={() => router.push("/signup")}>
            Crear una cuenta
          </HeaderButton>
        </AppHeader>
      </div>

      <Layout>{children}</Layout>

      <Footer>
        <FooterContent>
          {/* <FooterContentLeft>
              <h2>Contacto</h2>
              <p>Bq Educación</p>
              <p>900 00 00 00</p>
              <p>soporte.bitbloq@bq.com</p>
            </FooterContentLeft> */}
          <FooterContentRight>
            <p>Bitbloq es un proyecto de:</p>
            <img src={bqLogo} alt="BQ" />
          </FooterContentRight>
        </FooterContent>
        <AppFooter />
      </Footer>
    </>
  );
};

export default LandingLayout;

/* Styled components */

const HeaderButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;

const MainNavigation = styled.nav`
  position: absolute;
  display: flex;
  left: 234px;
`;

const NavLink = styled.a<{ active?: boolean }>`
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;
  font-weight: ${props => (props.active ? 900 : 400)};
`;

const ExerciseDropDown = styled.div`
  width: 280px;
  margin-top: 12px;
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

const Footer = styled.div`
  color: white;
  font-size: 14px;
  background-color: #5d6069;
`;

const FooterContent = styled(Layout)`
  display: flex;
  padding: 40px 50px;
  justify-content: flex-end;
`;

const FooterContentLeft = styled.div`
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  p {
    margin-top: 10px;
  }
`;

const FooterContentRight = styled.div`
  display: flex;
  width: 480.56px;
  align-items: center;
  p {
    margin-right: 20px;
    white-space: nowrap;
  }
`;
