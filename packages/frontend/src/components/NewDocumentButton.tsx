import React, { FC, useRef } from "react";
import styled from "@emotion/styled";
import { colors, Button, DropDown, Icon } from "@bitbloq/ui";
import { documentTypes } from "../config";
import OpenDocumentInput, {
  IOpenDocumentInputHandle
} from "./OpenDocumentInput";

export interface INewDocumentButtonProps {
  arrowOffset?: number;
  className?: string;
  quaternary?: boolean;
  attachmentPosition?: string;
  targetPosition?: string;
}

const NewDocumentButton: FC<INewDocumentButtonProps> = ({
  arrowOffset = 0,
  quaternary,
  attachmentPosition = "top center",
  targetPosition = "bottom center"
}) => {
  const onNewDocument = (type: string) => {
    window.open(`/app/edit-document/local/${type}/new`);
  };

  const openDocumentRef = useRef<IOpenDocumentInputHandle>(null);

  const onOpenDocument = () => {
    if (openDocumentRef.current) {
      openDocumentRef.current.open();
    }
  };

  return (
    <>
      <DropDown
        attachmentPosition={attachmentPosition}
        targetPosition={targetPosition}
      >
        {(isOpen: boolean) => (
          <StyledButton tertiary={!quaternary} quaternary={quaternary}>
            <Icon name="new-document" />
            Nuevo documento
          </StyledButton>
        )}
        <Container arrowOffset={arrowOffset}>
          <NewDocumentOptions>
            {Object.keys(documentTypes).map(type => (
              <NewDocumentOption
                key={type}
                comingSoon={!documentTypes[type].supported}
                color={documentTypes[type].color}
                onClick={() =>
                  documentTypes[type].supported && onNewDocument(type)
                }
              >
                <NewDocumentOptionIcon>
                  <Icon name={documentTypes[type].icon} />
                </NewDocumentOptionIcon>
                <NewDocumentLabel>
                  {documentTypes[type].label}
                  {!documentTypes[type].supported && (
                    <ComingSoon>Próximamente</ComingSoon>
                  )}
                </NewDocumentLabel>
              </NewDocumentOption>
            ))}
          </NewDocumentOptions>
          <OpenDocumentButton onClick={() => onOpenDocument()}>
            <NewDocumentOptionIcon>
              <Icon name="open-document" />
            </NewDocumentOptionIcon>
            Abrir documento
          </OpenDocumentButton>
        </Container>
      </DropDown>
      <OpenDocumentInput ref={openDocumentRef} />
    </>
  );
};

export default NewDocumentButton;

const StyledButton = styled(Button)`
  svg {
    height: 20px;
    margin-right: 8px;
  }
`;

const Container = styled.div<{ arrowOffset }>`
  margin-top: 12px;
  margin-right: ${props => (props.arrowOffset ? -50 : 0)}px;
  transform: translateX(${props => (props.arrowOffset ? -50 : 0)}px);
  background-color: white;
  border-radius: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  padding: 10px;
  width: 280px;

  &::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    transform: translate(${props => -50 - props.arrowOffset}%, 0) rotate(45deg);
    top: -10px;
    left: ${props => 50 + props.arrowOffset}%;
  }
`;

const NewDocumentOptions = styled.div`
  padding: 10px 10px 0px 10px;
  border-bottom: 1px solid ${colors.gray3};
`;

const NewDocumentOptionIcon = styled.div`
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  svg {
    width: 24px;
  }
`;

const ComingSoon = styled.div`
  margin-top: 4px;
  font-size: 12px;
  text-transform: uppercase;
  color: ${colors.gray3};
`;

const NewDocumentOption = styled.div<{ comingSoon: boolean; color: string }>`
  cursor: pointer;
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  font-size: 14px;
  position: relative;
  border-radius: 4px;

  ${NewDocumentOptionIcon} {
    background-color: ${props => props.color};
  }

  &:hover {
    background-color: ${props => props.color};
    color: white;
  }

  &:hover ${ComingSoon} {
    position: absolute;
    top: -4px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    border-radius: 4px;
    background-color: ${colors.black};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NewDocumentLabel = styled.div`
  font-weight: 500;
  margin-right: 10px;
`;

const OpenDocumentButton = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  margin: 10px;
  font-size: 14px;
  cursor: pointer;
  height: 40px;
  border-radius: 4px;

  ${NewDocumentOptionIcon} {
    color: inherit;
    background-color: ${colors.gray3};
    svg {
      width: 20px;
    }
  }

  &:hover {
    background-color: ${colors.gray3};
  }
`;
