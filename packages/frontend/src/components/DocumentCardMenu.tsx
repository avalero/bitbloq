import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Icon, colors } from "@bitbloq/ui";

export interface Option {
  disabled?: boolean;
  iconName?: string;
  label: string;
  onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  red?: boolean;
  selected?: boolean;
}

export interface DocumentCardMenuProps {
  className?: string;
  options?: Option[];
}

const DocumentCardMenu: FC<DocumentCardMenuProps> = ({
  className,
  options
}) => {
  return (
    <DocumentMenu className={className}>
      {options &&
        options.map((option: Option, index: number) => (
          <DocumentMenuOption
            key={index}
            onClick={option.disabled ? () => {} : option.onClick}
            disabled={option.disabled}
            red={option.red}
            selected={option.selected}
          >
            <p>
              {option.iconName && <MenuIcon name={option.iconName} />}
              {option.label}
            </p>
          </DocumentMenuOption>
        ))}
    </DocumentMenu>
  );
};

export default DocumentCardMenu;

/**styled components */

const DocumentMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 179px;
  height: auto;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  justify-content: flex-end;
  align-items: flex-end;
  &:hover {
    cursor: pointer;
  }
`;

interface DocumentMenuOptionProps {
  disabled?: boolean;
  red?: boolean;
  selected?: boolean;
}
const DocumentMenuOption = styled.div<DocumentMenuOptionProps>`
  width: 179px;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  width: 100%;
  background-color: ${(props: DocumentMenuOptionProps) =>
    props.selected ? "#ebebeb" : "white"};

  opacity: ${(props: DocumentMenuOptionProps) => (props.disabled ? 0.5 : 1)};

  p {
    margin-left: 13px;
    color: ${(props: DocumentMenuOptionProps) =>
      props.red ? colors.red : "#3b3e45"};
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  &:hover {
    background-color: #ebebeb;
  }

  &:first-of-type {
    border-radius: 4px 4px 0 0;
  }

  &:last-of-type {
    border: none;
    border-radius: 0 0 4px 4px;
  }
`;

const MenuIcon = styled(Icon)`
  margin-right: 14px;
`;
