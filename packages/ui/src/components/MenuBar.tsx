import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Icon from "./Icon";

interface SubMenuProps {
  isTop?: boolean;
}
const SubMenu = styled.div<SubMenuProps>`
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

interface ContainerProps {
  disabled: boolean;
}
const Container = styled.div<ContainerProps>`
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

export interface MenuOption {
  id: string;
  label: string;
  icon?: React.ReactElement<SVGElement>;
  children?: MenuOption[];
  checked?: boolean;
}

export interface MainMenuOption {
  id: string;
  label: string;
  children: MenuOption[];
}

export type OptionClickHandler = (option: MenuOption) => void;

export interface MenuBarProps {
  options: MainMenuOption[];
  onOptionClick?: OptionClickHandler;
}

interface State {
  disabled: boolean;
}

class MenuBar extends React.Component<MenuBarProps, State> {
  state = {
    disabled: false
  };

  onOptionClick(option: MenuOption) {
    const { onOptionClick } = this.props;
    this.setState({ disabled: true });

    if (onOptionClick) {
      onOptionClick(option);
    }
  }

  onMouseOver = () => {
    this.setState({ disabled: false });
  };

  renderSubMenu(options: MenuOption[], isTop?: boolean) {
    return (
      <SubMenu isTop={isTop}>
        {options.map(option => (
          <Option key={option.id} onClick={() => this.onOptionClick(option)}>
            {option.icon && <OptionIcon>{option.icon}</OptionIcon>}
            <OptionText>{option.label}</OptionText>
            {option.children && (
              <RightArrow>
                <Icon name="arrow" />
              </RightArrow>
            )}
            {option.children && this.renderSubMenu(option.children)}
            {option.checked && (
              <Tick>
                <Icon name="tick" />
              </Tick>
            )}
          </Option>
        ))}
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
