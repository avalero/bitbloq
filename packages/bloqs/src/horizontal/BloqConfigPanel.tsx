import React, { FC } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";
import Configuration from "./Configuration";
import { Icon, JuniorSwitch, JuniorButton } from "@bitbloq/ui";
import SelectComponent from "./SelectComponent";

import { BloqCategory } from "../enums";
import {
  IBloq,
  IBloqTypeGroup,
  IBloqType,
  IComponentInstance,
  isBloqSelectComponentParameter
} from "../index";

interface IBloqConfigPanelProps {
  isOpen: boolean;
  bloqTypes: IBloqType[];
  onSelectBloqType: (bloqType: IBloqType) => any;
  selectedPlaceholder: number;
  selectedBloq: IBloq;
  selectedBloqIndex: number;
  getBloqPort: (bloq: IBloq) => string | undefined;
  onUpdateBloq: (newBloq: IBloq) => any;
  onDeleteBloq: () => any;
  onClose: () => any;
  getComponents: (types: string[]) => IComponentInstance[];
}

const BloqConfigPanel: FC<IBloqConfigPanelProps> = ({
  isOpen,
  bloqTypes,
  onSelectBloqType,
  selectedPlaceholder,
  selectedBloq,
  selectedBloqIndex,
  getBloqPort,
  onUpdateBloq,
  onDeleteBloq,
  onClose,
  getComponents
}) => {
  const addEvent = selectedPlaceholder === 0;
  const addAction = selectedPlaceholder >= 0;

  let content = null;

  if (addEvent || addAction) {
    const filteredTypes = addEvent
      ? bloqTypes.filter(t => t.category === BloqCategory.Event)
      : bloqTypes.filter(
          t =>
            t.category === BloqCategory.Action ||
            t.category === BloqCategory.Wait
        );

    content = (
      <>
        <BloqTab bloqPosition={selectedPlaceholder}>
          <BloqPlaceholder
            category={addEvent ? BloqCategory.Event : BloqCategory.Action}
          />
        </BloqTab>
        <BloqList>
          {filteredTypes.map(type => (
            <StyledBloq
              key={type.name}
              type={type}
              onClick={() => onSelectBloqType(type)}
            />
          ))}
        </BloqList>
      </>
    );
  }

  if (selectedBloq) {
    const bloqType = bloqTypes.find(t => t.name === selectedBloq.type)!;

    const parameters = bloqType.parameters || [];
    const componentParam = parameters.find(isBloqSelectComponentParameter);

    content = (
      <>
        <BloqTab bloqPosition={selectedBloqIndex}>
          <HorizontalBloq
            type={bloqType}
            bloq={selectedBloq}
            port={getBloqPort(selectedBloq)}
          />
        </BloqTab>
        <ConfigContainer>
          <Configuration
            bloqType={bloqType}
            bloq={selectedBloq}
            onChange={onUpdateBloq}
          />
        </ConfigContainer>
        <ConfigRight>
          <ConfigPinsContainer>
            {componentParam &&
              <SelectComponent
                value={selectedBloq.parameters[componentParam.name] as string}
                components={getComponents(bloqType.components || [])}
                onChange={(value: any) =>
                  onUpdateBloq(
                    update(selectedBloq, { parameters: { [componentParam.name]: { $set: value } } })
                  )
                }
              />
            }
          </ConfigPinsContainer>
          <DeleteButton red onClick={onDeleteBloq}>
            <Icon name="trash" />
            Eliminar bloque
          </DeleteButton>
        </ConfigRight>
      </>
    );
  }

  return (
    <Container isOpen={isOpen}>
      {isOpen && (
        <CloseButton onClick={onClose}>
          <Icon name="close" />
        </CloseButton>
      )}
      {content}
    </Container>
  );
};

export default BloqConfigPanel;

/* Styled components */

interface IContainerProps {
  isOpen: boolean;
}
const Container = styled.div<IContainerProps>`
  position: absolute;
  top: 80px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  transition: transform 0.3 ease-out;
  background-color: white;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  display: flex;
  transform: translate(0, ${props => (props.isOpen ? "0" : "100%")});
`;

const CloseButton = styled.div`
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  position: absolute;
  top: -30px;
  right: 0px;

  svg {
    height: 24px;
    width: 24px;
  }
`;

interface IBloqTabProps {
  bloqPosition: number;
}
const BloqTab = styled.div<IBloqTabProps>`
  position: absolute;
  top: -72px;
  left: ${props =>
    (props.bloqPosition > 0 ? 65 : 60) + props.bloqPosition * 65}px;
  background-color: white;
  height: 70px;
  padding: 10px 10px 0px 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;

const BloqList = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin: 7px;
`;

const ConfigContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ConfigRight = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 210px;
  margin-top: 20px;
`;

const ConfigPinsContainer = styled.div`
  flex: 1;
`;

const DeleteButton = styled(JuniorButton)`
  svg {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;
