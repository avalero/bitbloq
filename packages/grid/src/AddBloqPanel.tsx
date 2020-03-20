import React, { FC } from "react";
import styled from "@emotion/styled";
import { Icon } from "@bitbloq/ui";
import {
  IBloqType,
  BloqCategory,
  BloqPlaceholder,
  HorizontalBloq
} from "@bitbloq/bloqs";
import { bloqTypes } from "./config";

interface IAddBloqPanelProps {
  isOpen: boolean;
  availableBloqs: { [bloq: string]: number };
  onSelectBloqType: (bloqType: IBloqType) => any;
  onClose: () => any;
  selectedLeft: number;
}

const AddBloqPanel: FC<IAddBloqPanelProps> = ({
  isOpen,
  availableBloqs,
  onSelectBloqType,
  onClose,
  selectedLeft
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Container>
      {isOpen && (
        <CloseButton onClick={onClose}>
          <Icon name="close" />
        </CloseButton>
      )}
      <BloqPlaceholderWrap left={selectedLeft + 10}>
        <BloqPlaceholder category={BloqCategory.Event} selected={true} />
      </BloqPlaceholderWrap>
      <BloqList>
        {Object.keys(availableBloqs).map(typeName => {
          const type = bloqTypes.find(t => t.name === typeName)!;
          return (
            <StyledBloq
              key={type.name}
              type={type}
              onClick={() => onSelectBloqType(type)}
            />
          );
        })}
      </BloqList>
    </Container>
  );
};

export default AddBloqPanel;

/* Styled components */

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: white;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 10; // zIndex description: 15
`;

const CloseButton = styled.div`
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0px;
  right: 0px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  svg {
    height: 20px;
    width: 20px;
  }
`;

interface IBloqPlaceholderWrapProps {
  left: number;
}
const BloqPlaceholderWrap = styled.div<IBloqPlaceholderWrapProps>`
  position: absolute;
  bottom: 0px;
  transform: translate(0, 100%);
  left: ${props => props.left}px;
  background-color: white;
  padding: 10px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const BloqList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
  flex-wrap: wrap;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin: 7px;
`;
