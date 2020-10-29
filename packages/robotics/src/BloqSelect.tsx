import React, { FC, useEffect, useRef, useState } from "react";
import { colors, Icon } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useMenuState, Menu, MenuItem, MenuButton } from "reakit/Menu";

export interface IOption {
  label: string;
  value: any;
}

export interface IBloqSelectProps {
  value?: any;
  options: IOption[];
  onChange?: (value: any) => void;
  inactive?: boolean;
}

const BloqSelect: FC<IBloqSelectProps> = ({
  value,
  options,
  onChange,
  inactive
}) => {
  const menu = useMenuState();
  const [width, setWidth] = useState(0);

  const optionsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (optionsRef.current) {
      setWidth(optionsRef.current.getBoundingClientRect().width - 2);
    }
  }, [options, menu.visible]);

  const selectedOption = options.find(o => o.value === value);

  const onOptionClick = (e: React.MouseEvent, option: IOption) => {
    e.preventDefault();
    menu.hide();
    if (onChange) {
      onChange(option.value);
    }
  };

  return (
    <Container visible={menu.visible}>
      <Button
        {...menu}
        style={{
          width,
          backgroundColor: inactive ? "white" : "rgba(0, 0, 0, 0.2)",
          color: inactive ? colors.black : "white"
        }}
      >
        {selectedOption?.label}
        <Arrow name="triangle" />
      </Button>
      <Options
        {...menu}
        aria-label="bloq select"
        style={{
          display: "block",
          visibility: menu.visible ? "visible" : "hidden"
        }}
      >
        <OptionsWrap ref={optionsRef}>
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
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    `}
`;

const Button = styled(MenuButton)<{ visible?: boolean }>`
  border-radius: 4px;
  box-shadow: inset 0 1px 3px 0 rgba(0, 0, 0, 0.24);
  height: 26px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding-right: 30px;
  position: relative;
  text-align: left;

  &:focus {
    outline: none;
  }

  ${props =>
    props.visible &&
    css`
      box-shadow: none;
      color: ${colors.black};
      background-color: #ffffff;
      z-index: 1001;
      border-bottom: solid 1px #cfcfcf;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;

      svg {
        color: ${colors.black};
      }
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
  z-index: 1000;

  &:focus {
    outline: none;
  }
`;

const Option = styled(MenuItem)`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 26px;
  padding: 0px 26px 0px 10px;
  text-align: left;
  border-bottom: solid 1px #cfcfcf;
  white-space: nowrap;
  width: 100%;

  &:hover,
  &:focus {
    background-color: #ebebeb;
    outline: none;
  }

  &:last-of-type {
    border-bottom: 0;
  }
`;

const OptionsWrap = styled.div`
  margin: -1px;
  background-color: white;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: solid 1px #cfcfcf;
`;
