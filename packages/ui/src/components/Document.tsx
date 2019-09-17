import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import MenuBar, {
  MainMenuOption,
  OptionClickHandler as MenuOptionClickHandler
} from "./MenuBar";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { IHeaderButton, HeaderButtonClickCallback } from "../index.d";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
`;

interface HeaderWrapProps {
  collapsed: boolean;
}
const HeaderWrap = styled.div<HeaderWrapProps>`
  height: 70px;
  overflow: hidden;
  transition: height 150ms ease-out;

  ${props =>
    props.collapsed &&
    css`
      height: 0px;
    `};
`;

const Header = styled.div`
  height: 69px;
  display: flex;
  border-bottom: 1px solid #dadada;
`;

const HeaderButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76px;
  border-left: 1px solid #dadada;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }
`;

interface DocumentIconProps {
  color: string;
}
const DocumentIcon = styled.div`
  width: 70px;
  background-color: ${props => props.color || "#4dc3ff"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 46px;
    height: 46px;
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

interface TitleProps {
  canEdit: boolean;
}
const Title = styled.div<TitleProps>`
  display: flex;
  align-items: center;
  padding-left: 18px;
  background-color: #ebebeb;
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

interface CollapsedButtonProps {
  collapsed: boolean;
}
const CollapseButton = styled.div<CollapsedButtonProps>`
  cursor: pointer;
  svg {
    width: 12px;
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

const Tabs = styled.div`
  width: 70px;
  min-width: 70px;
  background-color: #3b3e45;
  color: white;
`;

interface TabIconProps {
  selected: boolean;
}
const TabIcon = styled.div<TabIconProps>`
  height: 70px;
  border-bottom: 1px solid #797c81;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

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

interface ContentProps {
  active: boolean;
}
const Content = styled.div<ContentProps>`
  display: none;
  flex: 1;
  overflow: hidden;

  ${props =>
    props.active &&
    css`
      display: flex;
    `};
`;

export interface TabProps {
  label: string;
  icon: JSX.Element;
  children: React.ReactChild;
}

export const Tab: React.SFC<TabProps> = props => null;

export interface DocumentProps {
  menuOptions?: MainMenuOption[];
  onMenuOptionClick?: MenuOptionClickHandler;
  menuRightContent?: React.ReactChild;
  headerRightContent?: React.ReactChildren;
  headerButtons?: IHeaderButton[];
  title?: JSX.Element | string;
  brandColor?: string;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  onEditTitle: () => any;
  onHeaderButtonClick?: HeaderButtonClickCallback;
  icon?: JSX.Element;
  preMenuContent?: JSX.Element;
  postMenuContent?: JSX.Element;
}

interface State {
  isHeaderCollapsed: boolean;
}

class Document extends React.Component<DocumentProps, State> {
  static Tab = Tab;

  state = {
    isHeaderCollapsed: false
  };

  onCollapseButtonClick = () => {
    this.setState(state => ({
      ...state,
      isHeaderCollapsed: !state.isHeaderCollapsed
    }));
  };

  render() {
    const {
      children,
      menuOptions = [],
      menuRightContent,
      headerRightContent,
      onMenuOptionClick,
      title,
      onEditTitle,
      brandColor,
      headerButtons = [],
      onHeaderButtonClick,
      tabIndex,
      onTabChange,
      icon,
      preMenuContent,
      postMenuContent
    } = this.props;
    const { isHeaderCollapsed } = this.state;

    const currentTab = React.Children.toArray(children)[tabIndex];

    return (
      <Container>
        <HeaderWrap collapsed={isHeaderCollapsed}>
          <Header>
            <DocumentIcon color={brandColor}>{icon}</DocumentIcon>
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
          <MenuBar options={menuOptions} onOptionClick={onMenuOptionClick} />
          {menuRightContent}
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
            {React.Children.map(
              children,
              (tab: React.ReactElement<TabProps>, i) => (
                <Tooltip position="right" content={tab.props.label}>
                  {tooltipProps => (
                    <TabIcon
                      {...tooltipProps}
                      selected={i === tabIndex}
                      onClick={() => onTabChange && onTabChange(i)}
                    >
                      {tab.props.icon}
                    </TabIcon>
                  )}
                </Tooltip>
              )
            )}
          </Tabs>
          {React.Children.map(
            children,
            (tab: React.ReactElement<TabProps>, i) => (
              <Content active={i === tabIndex}>{tab.props.children}</Content>
            )
          )}
        </Main>
      </Container>
    );
  }
}

export default Document;
