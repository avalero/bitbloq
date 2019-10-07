import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Icon } from "@bitbloq/ui";

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
        <MenuIcon name="pencil" />
        Cambiar nombre
      </DocumentMenuOption>
      <DocumentMenuOption onClick={onCopy}>
        <MenuIcon name="duplicate" />
        Crear una copia
      </DocumentMenuOption>
      <DocumentMenuOption onClick={onMove}>
        <MenuIcon name="move-document" />
        Mover a
      </DocumentMenuOption>
      <DocumentMenuOption delete={true} onClick={onDelete}>
        <MenuIcon name="trash" />
        Eliminar {(folder && "carpeta") || (document && "documento")}
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
  font-size: 14px;
  cursor: pointer;
  padding: 0px 20px;

  color: ${props => (props.delete ? "red" : "black")};

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
