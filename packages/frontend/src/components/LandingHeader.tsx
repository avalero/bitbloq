import React, { FC, useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import { Button, DropDown, Icon, Input, useTranslate } from "@bitbloq/ui";
import AppHeader from "./AppHeader";
import NewDocumentButton from "./NewDocumentButton";
import OpenExerciseForm from "./OpenExerciseForm";

export interface ILandingHeader {
  fixed?: boolean;
}

const LandingHeader: FC<ILandingHeader> = ({ fixed }) => {
  const router = useRouter();
  const t = useTranslate();
  const headerRef = useRef<HTMLDivElement>(null);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);

  useEffect(() => {
    if (!fixed) {
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
    <div ref={headerRef}>
      <AppHeader isSticky={fixed ? undefined : isHeaderSticky}>
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
  );
};

export default LandingHeader;

/* styled components */

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
