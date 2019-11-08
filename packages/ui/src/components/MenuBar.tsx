import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Icon from "./Icon";

interface ISubMenuProps {
  isTop?: boolean;
}
const SubMenu = styled.div<ISubMenuProps>`
  position: absolute;
  display: none;
  top: 0px;
  right: 1px;
  background: white;
  z-index: 10;
  flex-direction: column;
  transform: translate(100%, 0);
  box-shadow: 0 12px 15px 1px rgba(0, 0, 0, 0.5);

  ${props =>
    props.isTop &&
    css`
      left: 0px;
      bottom: 0px;
      top: inherit;
      right: inherit;
      transform: translate(0, 100%);
    `};
`;

const OptionText = styled.div`
  flex: 1;
`;

const OptionIcon = styled.div`
  margin-right: 12px;
  svg {
    width: 13px;
  }
`;

const RightArrow = styled.div`
  margin-left: 12px;
  transform: rotate(90deg);
`;

const Tick = styled.div`
  margin-left: 12px;
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  white-space: nowrap;
  font-size: 14px;
  height: 35px;
  padding: 0px 12px;
  cursor: pointer;

  &:hover {
    background-color: #ebebeb;
  }

  &:hover > ${SubMenu} {
    display: flex;
  }
`;

const MainOption = styled(Option)`
  height: 40px;

  &:hover {
    box-shadow: 0 12px 15px 1px rgba(0, 0, 0, 0.5);
    z-index: 10;
    background-color: white;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #cfcfcf;
`;

interface IContainerProps {
  disabled: boolean;
}
const Container = styled.div<IContainerProps>`
  display: flex;
  flex: 1;
  align-items: center;
  height: 40px;
  padding: 0px 10px;
  font-size: 14px;

  ${props =>
    props.disabled &&
    css`
      ${MainOption} {
        pointer-events: none;
      }
    `};
`;

export interface IMenuOption {
  id: string;
  label: string;
  icon?: React.ReactElement<SVGElement>;
  checked?: boolean;
  onClick?: (e: React.MouseEvent, option: IMenuOption) => void;
  type: "option";
}

export interface ISubMenu {
  id: string;
  label: string;
  icon?: React.ReactElement<SVGElement>;
  children: Array<IMenuItem>;
  type: "submenu";
}

export interface IMenuDivider {
  type: "divider";
}

type IMenuItem = IMenuOption | ISubMenu | IMenuDivider;

export interface IMainMenuOption {
  id: string;
  label: string;
  children: Array<IMenuItem>;
}

export interface IMenuBarProps {
  options: IMainMenuOption[];
}

interface IState {
  disabled: boolean;
}

class MenuBar extends React.Component<IMenuBarProps, IState> {
  state = {
    disabled: false
  };

  onOptionClick(e: React.MouseEvent, option: IMenuOption) {
    this.setState({ disabled: true });

    if (option.onClick) {
      option.onClick(e, option);
    }
  }

  onMouseOver = () => {
    this.setState({ disabled: false });
  };

  renderSubMenu(options: Array<IMenuItem>, isTop?: boolean) {
    return (
      <SubMenu isTop={isTop}>
        {options.map((option, i) => {
          if (option.type === "divider") {
            return <Divider key={`divider-${i}`} />;
          }

          if (option.type === "submenu") {
            return (
              <Option
                key={option.id}
              >
                {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
                <OptionText>{option.label}</OptionText>
                <RightArrow>
                  <Icon name="triangle" />
                </RightArrow>
                {this.renderSubMenu(option.children)}
              </Option>
            );
          }

          return (
            <Option
              key={option.id}
              onClick={e => this.onOptionClick(e, option)}
            >
              {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
              <OptionText>{option.label}</OptionText>
              {option.checked && (
                <Tick>
                  <Icon name="tick" />
                </Tick>
              )}
            </Option>
          );
        })}
      </SubMenu>
    );
  }

  render() {
    const { disabled } = this.state;
    const { options } = this.props;

    return (
      <Container disabled={disabled} onMouseOver={this.onMouseOver}>
        {options.map(option => (
          <MainOption key={option.id}>
            <OptionText>{option.label}</OptionText>
            {this.renderSubMenu(option.children, true)}
          </MainOption>
        ))}
      </Container>
    );
  }
}

export default MenuBar;
