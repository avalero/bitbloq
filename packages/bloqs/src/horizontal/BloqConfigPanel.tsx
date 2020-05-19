import React, { FC, useState, useEffect } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";
import Configuration from "./Configuration";
import { Icon, JuniorSwitch, JuniorButton } from "@bitbloq/ui";
import PinSelector from "./PinSelector";
import LedOnIcon from "./configuration/icons/led-on.svg";
import ClockIcon from "./configuration/icons/clock.svg";

import { BloqCategory } from "../enums";
import {
  IBloq,
  IBloqTypeGroup,
  IBloqType,
  IBoard,
  IComponent,
  IComponentInstance,
  IExtraData,
  isBloqSelectComponentParameter
} from "../index";

interface IBloqConfigPanelProps {
  isOpen: boolean;
  bloqTypes: IBloqType[];
  availableBloqs: IBloqType[];
  onSelectBloqType: (bloqType: IBloqType) => any;
  selectedPlaceholder: number;
  selectedBloq: IBloq;
  getBloqPort: (bloq: IBloq) => string | undefined;
  onUpdateBloq: (newBloq: IBloq) => any;
  onDeleteBloq: () => any;
  onClose: () => any;
  getComponents: (types: string[]) => IComponentInstance[];
  board: IBoard;
  components: IComponent[];
  selectedLeft: number;
  extraData?: IExtraData;
  onExtraDataChange?: (extraData: IExtraData) => void;
}

const BloqConfigPanel: FC<IBloqConfigPanelProps> = ({
  isOpen,
  bloqTypes,
  availableBloqs,
  onSelectBloqType,
  selectedPlaceholder,
  selectedBloq,
  getBloqPort,
  onUpdateBloq,
  onDeleteBloq,
  onClose,
  getComponents,
  board,
  components,
  selectedLeft,
  extraData,
  onExtraDataChange
}) => {
  const [selectedTab, setSelectedTab] = useState(BloqCategory.Action);

  useEffect(() => {
    setSelectedTab(BloqCategory.Action);
  }, [isOpen, selectedPlaceholder]);

  const addEvent = selectedPlaceholder === 0;
  const addAction = selectedPlaceholder > 0;

  let content = <></>;

  if (addEvent) {
    const filteredTypes = availableBloqs.filter(
      t => t.category === BloqCategory.Event
    );

    content = (
      <>
        <BloqPlaceholderWrap left={selectedLeft}>
          <BloqPlaceholder
            category={addEvent ? BloqCategory.Event : BloqCategory.Action}
            selected={true}
          />
        </BloqPlaceholderWrap>
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

  if (addAction) {
    const filteredTypes = availableBloqs.filter(
      t => t.category === selectedTab
    );

    content = (
      <>
        <BloqPlaceholderWrap left={selectedLeft}>
          <BloqPlaceholder
            category={addEvent ? BloqCategory.Event : BloqCategory.Action}
            selected={true}
          />
        </BloqPlaceholderWrap>
        <BloqTabs>
          <BloqTab
            selected={selectedTab === BloqCategory.Action}
            onClick={() => setSelectedTab(BloqCategory.Action)}
          >
            <img src={LedOnIcon} />
          </BloqTab>
          <BloqTab
            selected={selectedTab === BloqCategory.Wait}
            onClick={() => setSelectedTab(BloqCategory.Wait)}
          >
            <img src={ClockIcon} />
          </BloqTab>
        </BloqTabs>
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
        <BloqPlaceholderWrap left={selectedLeft}>
          <HorizontalBloq
            type={bloqType}
            bloq={selectedBloq}
            port={getBloqPort(selectedBloq)}
          />
          <DeleteWrap>
            <DeleteButton red onClick={onDeleteBloq}>
              <Icon name="trash" />
            </DeleteButton>
          </DeleteWrap>
        </BloqPlaceholderWrap>
        <ConfigContainer>
          <Configuration
            bloqType={bloqType}
            bloq={selectedBloq}
            onChange={onUpdateBloq}
            extraData={extraData}
            onExtraDataChange={onExtraDataChange}
          />
          {componentParam && (
            <PinSelector
              value={selectedBloq.parameters[componentParam.name] as string}
              componentInstances={getComponents(bloqType.components || [])}
              fallbackComponent={(bloqType.components || [])[0]}
              onChange={(value: any) =>
                onUpdateBloq(
                  update(selectedBloq, {
                    parameters: { [componentParam.name]: { $set: value } }
                  })
                )
              }
              board={board}
              components={components}
            />
          )}
        </ConfigContainer>
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
  top: 123px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  transition: transform 0.3 ease-out;
  background-color: white;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: translate(0, ${props => (props.isOpen ? "0" : "100%")});
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
  top: -40px;
  right: 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;

  svg {
    height: 20px;
    width: 20px;
  }
`;

const BloqPlaceholderWrap = styled.div<{ left: number }>`
  position: absolute;
  top: 0px;
  transform: translate(0, -100%);
  left: ${props => props.left + 52}px;
  background-color: white;
  padding: 10px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`;

const BloqTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

interface IBloqTabProps {
  selected?: boolean;
}
const BloqTab = styled.div<IBloqTabProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${props => (props.selected ? "#c0c3c9" : "#ebebeb")};
  margin: ${props => (props.selected ? 0 : -3)}px 3px 0px 3px;
  box-shadow: ${props => (props.selected ? "none" : "0 3px 0 0 #dddddd")};

  &:first-of-type {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-of-type {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  img {
    width: 32px;
    height: 32px;
  }
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

const ConfigContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 15px 10px;
  width: 100%;
  box-sizing: border-box;
`;

const DeleteWrap = styled.div`
  position: absolute;
  top: 0px;
  right: 10px;
  transform: translate(100%, 0);
  background: white;
  padding: 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const DeleteButton = styled(JuniorButton)`
  padding: 10px;
  width: 40px;
  height: 40px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
