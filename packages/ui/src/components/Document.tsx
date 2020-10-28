import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import MenuBar, { IMainMenuOption } from "./MenuBar";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import breakpoints from "../breakpoints";

const TABLET_FRAME_WIDTH = 50;
const DESKTOP_FRAME_WIDTH = 70;

export interface IHeaderButton {
  id: string;
  icon: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  background-color: white;
`;

const HeaderWrap = styled.div<{ collapsed: boolean }>`
  height: ${props => (props.collapsed ? 0 : TABLET_FRAME_WIDTH)}px;
  overflow: hidden;
  transition: height 150ms ease-out;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: ${props => (props.collapsed ? 0 : DESKTOP_FRAME_WIDTH)}px;
  }
`;

const Header = styled.div`
  background-color: #ebebeb;
  height: ${TABLET_FRAME_WIDTH - 1}px;
  display: flex;
  border-bottom: 1px solid #dadada;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: ${DESKTOP_FRAME_WIDTH - 1}px;
  }
`;

const HeaderButton = styled.div`
  display: flex;
  align-items: center;
  background-color: #fcfcfc;
  justify-content: center;
  width: ${TABLET_FRAME_WIDTH}px;
  border-left: 1px solid #dadada;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: ${DESKTOP_FRAME_WIDTH}px;
  }
`;

const DocumentIcon = styled.div<{ color?: string; pointer?: boolean }>`
  width: ${TABLET_FRAME_WIDTH}px;
  background-color: ${props => props.color || "#4dc3ff"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => (props.pointer ? "pointer" : "auto")};

  .back {
    display: none;
  }

  &:hover {
    .back {
      display: block;
    }
    .main {
      display: ${props => (props.pointer ? "none" : "block")};
    }
  }

  svg {
    width: 33px;
    height: 33px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: ${DESKTOP_FRAME_WIDTH}px;
    svg {
      width: 46px;
      height: 46px;
    }
  }
`;

const EditTitleIcon = styled.div`
  display: none;

  svg {
    width: 14px;
    height: 14px;
    margin-left: 12px;
  }
`;

const Title = styled.div<{ canEdit: boolean }>`
  display: flex;
  align-items: center;
  padding-left: 18px;
  flex: 1;
  font-weight: 500;
  font-style: italic;

  span {
    display: flex;
    align-items: center;
  }

  ${props =>
    props.canEdit &&
    css`
      span {
        cursor: pointer;
        &:hover {
          ${EditTitleIcon} {
            display: block;
          }
        }
      }
    `}
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MenuWrap = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  border-bottom: 1px solid #cfcfcf;
`;

const CollapseButton = styled.div<{ collapsed: boolean }>`
  cursor: pointer;
  svg {
    width: 18px;
    margin: 0px 12px;
    transition: transform 150ms ease-out;
  }

  ${props =>
    props.collapsed &&
    css`
      svg {
        transform: rotateX(180deg);
      }
    `};
`;

const FullScreenButton = styled.div`
  cursor: pointer;
  svg {
    width: 18px;
  }
`;

const Tabs = styled.div`
  width: ${TABLET_FRAME_WIDTH}px;
  min-width: ${TABLET_FRAME_WIDTH}px;
  background-color: #3b3e45;
  color: white;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: ${DESKTOP_FRAME_WIDTH}px;
    min-width: ${DESKTOP_FRAME_WIDTH}px;
  }
`;

const TabIcon = styled.div<{ selected: boolean }>`
  height: ${TABLET_FRAME_WIDTH}px;
  border-bottom: 1px solid #797c81;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: ${DESKTOP_FRAME_WIDTH}px;
  }

  svg {
    width: 24px;
    height: 24px;
    opacity: 0.5;
  }

  ${props =>
    props.selected &&
    css`
      background-color: #1e1f21;

      svg {
        opacity: 1;
      }
    `};
`;

const Content = styled.div<{ active: boolean }>`
  display: none;
  flex: 1;
  overflow: hidden;

  ${props =>
    props.active &&
    css`
      display: flex;
    `};
`;

export interface IDocumentTab {
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode | ((isActive: boolean) => React.ReactNode);
}

export interface IDocumentProps {
  menuOptions?: IMainMenuOption[];
  menuRightContent?: React.ReactChild;
  headerRightContent?: JSX.Element;
  headerButtons?: IHeaderButton[];
  title?: JSX.Element | string;
  brandColor?: string;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  onEditTitle: () => any;
  onHeaderButtonClick?: (id: string) => any;
  icon?: JSX.Element;
  preMenuContent?: JSX.Element;
  postMenuContent?: JSX.Element;
  backCallback?: () => any;
  tabs: IDocumentTab[];
}

interface IState {
  isHeaderCollapsed: boolean;
}

class Document extends React.Component<IDocumentProps, IState> {
  public state = {
    isHeaderCollapsed: false
  };

  public render(): React.ReactNode {
    const {
      menuOptions = [],
      menuRightContent,
      headerRightContent,
      title,
      onEditTitle,
      brandColor,
      headerButtons = [],
      onHeaderButtonClick,
      tabIndex,
      onTabChange,
      icon,
      preMenuContent,
      postMenuContent,
      backCallback,
      tabs
    } = this.props;
    const { isHeaderCollapsed } = this.state;

    return (
      <Container>
        <HeaderWrap collapsed={isHeaderCollapsed}>
          <Header>
            <DocumentIcon
              pointer={!!backCallback}
              color={brandColor}
              onClick={() => {
                if (backCallback) {
                  backCallback();
                }
              }}
            >
              {icon && icon.props ? (
                <Icon className="main" name={icon.props.name} />
              ) : (
                ""
              )}
              {backCallback ? <Icon className="back" name="arrow-left" /> : ""}
            </DocumentIcon>
            <Title canEdit={!!onEditTitle} onClick={onEditTitle}>
              <span>
                {title}
                <EditTitleIcon>
                  <Icon name="pencil" />
                </EditTitleIcon>
              </span>
            </Title>
            {headerRightContent}
            {headerButtons.map(button => (
              <HeaderButton
                key={button.id}
                onClick={() =>
                  onHeaderButtonClick && onHeaderButtonClick(button.id)
                }
              >
                <Icon name={button.icon} />
              </HeaderButton>
            ))}
          </Header>
        </HeaderWrap>
        {preMenuContent}
        <MenuWrap>
          <MenuBar options={menuOptions} />
          {menuRightContent}
          <FullScreenButton onClick={this.onFullScreenClick}>
            <Icon name="full-screen" />
          </FullScreenButton>
          <CollapseButton
            onClick={this.onCollapseButtonClick}
            collapsed={isHeaderCollapsed}
          >
            <Icon name="angle-double" />
          </CollapseButton>
        </MenuWrap>
        {postMenuContent}
        <Main>
          <Tabs>
            {tabs.map((tab, i) => (
              <Tooltip position="right" content={tab.label} key={i}>
                {tooltipProps => (
                  <TabIcon
                    {...tooltipProps}
                    selected={i === tabIndex}
                    onClick={() => onTabChange && onTabChange(i)}
                  >
                    {tab.icon}
                  </TabIcon>
                )}
              </Tooltip>
            ))}
          </Tabs>
          {tabs.map((tab, i) => (
            <Content key={i} active={i === tabIndex}>
              {typeof tab.content === "function"
                ? tab.content(i === tabIndex)
                : tab.content}
            </Content>
          ))}
        </Main>
      </Container>
    );
  }

  private onCollapseButtonClick = () => {
    this.setState(state => ({
      ...state,
      isHeaderCollapsed: !state.isHeaderCollapsed
    }));
  };

  private onFullScreenClick = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.body.requestFullscreen();
    }
  };
}

export default Document;
