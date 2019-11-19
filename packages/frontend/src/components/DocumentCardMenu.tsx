import React, { FC } from "react";
import styled from "@emotion/styled";
import { Icon, colors } from "@bitbloq/ui";

export interface IOption {
  disabled?: boolean;
  iconName?: string;
  label: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  red?: boolean;
  selected?: boolean;
}

export interface IDocumentCardMenuProps {
  className?: string;
  options: Array<IOption | undefined>;
}

const DocumentCardMenu: FC<IDocumentCardMenuProps> = ({
  className,
  options = []
}) => {
  return (
    <DocumentMenu className={className}>
      {options.map(
        (option: IOption, index: number) =>
          option && (
            <DocumentMenuOption
              key={index}
              onClick={e =>
                option.disabled ? e.stopPropagation() : option.onClick(e)
              }
              disabled={option.disabled}
              red={option.red}
              selected={option.selected}
            >
              <p>
                {option.iconName && <MenuIcon name={option.iconName} />}
                {option.label}
              </p>
            </DocumentMenuOption>
          )
      )}
    </DocumentMenu>
  );
};

export default DocumentCardMenu;

/* styled components */

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

interface IDocumentMenuOptionProps {
  disabled?: boolean;
  red?: boolean;
  selected?: boolean;
}
const DocumentMenuOption = styled.div<IDocumentMenuOptionProps>`
  width: 179px;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  width: 100%;
  background-color: ${props => (props.selected ? "#ebebeb" : "white")};

  opacity: ${props => (props.disabled ? 0.5 : 1)};

  p {
    margin-left: 13px;
    color: ${props => (props.red ? colors.red : "#3b3e45")};
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
