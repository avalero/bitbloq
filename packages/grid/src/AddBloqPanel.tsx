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
      <BloqsWrapper>
        <Bloqs>
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
        </Bloqs>
      </BloqsWrapper>
    </Container>
  );
};

export default AddBloqPanel;

/* Styled components */

const Container = styled.div`
  align-items: center;
  background-color: white;
  bottom: 0;
  box-sizing: border-box;
  display: flex;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  flex-direction: column;
  justify-content: center;
  padding: 20px 100px 10px;
  position: absolute;
  width: 100%;
  z-index: 10; // zIndex description: 15
`;

const CloseButton = styled.div`
  align-items: center;
  background-color: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 40px;
  position: absolute;
  right: 0;
  top: 0;
  transform: translate(-50%, -100%);
  width: 40px;

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

const Bloqs = styled.div`
  display: flex;
`;

const BloqsWrapper = styled.div`
  display: flex;
  overflow: auto;
  width: 100%;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin: 7px;
`;
