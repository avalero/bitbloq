import React, { FC } from "react";
import { colors, Icon } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMenuState, Menu, MenuItem, MenuDisclosure } from "reakit/Menu";

export interface IOption {
  label: string;
  value: any;
}

export interface IBloqSelectProps {
  value?: any;
  options: IOption[];
  onChange?: (value: any) => void;
}

const BloqSelect: FC<IBloqSelectProps> = ({ value, options, onChange }) => {
  const selectedOption = options.find(o => o.value === value) || options[0];

  const menu = useMenuState();

  const onOptionClick = (e: React.MouseEvent, option: IOption) => {
    e.preventDefault();
    menu.hide();
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <Container {...menu}>
      <Button {...menu}>
        {selectedOption?.label}
        <Arrow name="triangle" />
      </Button>
      <Options {...menu}>
        <OptionsWrap>
          {options.map(option => (
            <Option
              {...menu}
              onClick={e => onOptionClick(e, option)}
              key={option.label}
            >
              {option.label}
            </Option>
          ))}
        </OptionsWrap>
      </Options>
    </Container>
  );
};

export default BloqSelect;

const Container = styled.div<{ visible?: boolean }>`
  position: relative;

  ${props =>
    props.visible &&
    css`
      box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
      border: solid 1px #cfcfcf;
      background-color: #ffffff;
    `}
`;

const Button = styled(MenuDisclosure)`
  border-radius: 4px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.24);
  background-color: rgba(0, 0, 0, 0.2);
  height: 26px;
  border: none;
  color: white;
  font-size: 14px;
  cursor: pointer;
  padding-right: 30px;
  position: relative;

  ${props =>
    props.visible &&
    css`
      box-shadow: none;
      border: none;
      color: ${colors.black};
      background-color: #ffffff;
    `}
`;

const Arrow = styled(Icon)`
  position: absolute;
  right: 6px;
  top: 6px;
  width: 14px;
  height: 14px;
  color: white;
  transform: rotate(180deg);
`;

const Options = styled(Menu)`
  background-color: white;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
  width: 100%;
  z-index: 1000;
`;

const Option = styled(MenuItem)`
  background: transparent;
  border: none
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 26px;
  padding: 0px 10px;
  text-align: left;
  border-bottom: solid 1px #cfcfcf;

  &:hover,
  &:focus {
    background-color: #ebebeb;
    outline: none;
  }
`;

const OptionsWrap = styled.div`
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;
