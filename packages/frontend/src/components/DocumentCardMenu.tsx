import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Icon, colors } from "@bitbloq/ui";

export interface DocumentCardMenuProps {
  document?: any;
  folder?: any;
  className?: string;
  onRename?: (e: React.MouseEvent) => any;
  onCopy?: (e: React.MouseEvent) => any;
  onMove?: (e: React.MouseEvent) => any;
  onDelete?: (e: React.MouseEvent) => any;
}

const DocumentCardMenu: FC<DocumentCardMenuProps> = ({
  document,
  folder,
  className,
  onRename,
  onCopy,
  onMove,
  onDelete
}) => {
  return (
    <DocumentMenu className={className}>
      <DocumentMenuOption onClick={onRename}>
        <p>
          <MenuIcon name="pencil" />
          Cambiar nombre
        </p>
      </DocumentMenuOption>
      <DocumentMenuOption onClick={onCopy}>
        <p>
          <MenuIcon name="duplicate" />
          Crear una copia
        </p>
      </DocumentMenuOption>
      <DocumentMenuOption onClick={onMove}>
        <p>
          <MenuIcon name="move-document" />
          Mover a
        </p>
      </DocumentMenuOption>
      <DocumentMenuOption delete={true} onClick={onDelete}>
        <p>
          <MenuIcon name="trash" />
          Eliminar {(folder && "carpeta") || (document && "documento")}
        </p>
      </DocumentMenuOption>
    </DocumentMenu>
  );
};

export default DocumentCardMenu;

/**styled components */

const DocumentMenu = styled.div`
  width: 179px;
  height: 143px;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  position: absolute;
  margin-left: 50px;
  margin-top: 53px;
`;

const DocumentMenuOption = styled.div<{ delete?: boolean }>`
  width: 179px;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;

  p {
    margin-left: 13px;
    color: ${props => (props.delete ? colors.red : "#3b3e45")};
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }
`;

const MenuIcon = styled(Icon)`
  margin-right: 14px;
`;
