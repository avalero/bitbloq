import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { colors, ScrollableTabs } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";
import HorizontalBloq from "./HorizontalBloq";

import { IBloqTypeGroup, IBloqType } from "../index";

interface IBloqTabs {
  icon: JSX.Element;
  groups: IBloqTypeGroup[];
  label: string;
}

export interface IAddBloqPanelProps {
  isOpen: boolean;
  bloqTabs: IBloqTabs[];
  bloqTypes: IBloqType[];
  onTypeSelected: (type: string) => any;
  onClick?: React.MouseEventHandler;
}

const AddBloqPanel: React.FunctionComponent<IAddBloqPanelProps> = ({
  isOpen,
  bloqTabs,
  bloqTypes,
  onTypeSelected,
  onClick
}) => {
  const wrapStyle = useSpring({
    width: isOpen ? 200 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  const [openGroup, setOpenGroup] = useState(-1);

  useEffect(() => {
    setOpenGroup(-1);
  }, [isOpen]);

  return (
    <Wrap style={wrapStyle} onClick={onClick}>
      <Tabs
        tabs={bloqTabs.map(tab => ({
          icon: tab.icon,
          content: (
            <GroupList>
              <GroupLabel>{tab.label}</GroupLabel>
              {tab.groups.map((group, i) => {
                const types = group.types.filter(t =>
                  bloqTypes.some(bt => bt.name === t)
                );

                if (types.length === 1) {
                  return (
                    <StyledBloq
                      key={i}
                      type={bloqTypes.find(t => t.name === types[0])!}
                      onClick={() => onTypeSelected(types[0])}
                    />
                  );
                }

                if (types.length > 1) {
                  const isGroupOpen = openGroup === i;

                  return (
                    <BloqGroupHandler
                      key={i}
                      isOpen={isGroupOpen}
                      group={group}
                      bloqTypes={bloqTypes}
                      onHandlerClick={() => setOpenGroup(isGroupOpen ? -1 : i)}
                      onTypeClick={onTypeSelected}
                    />
                  );
                }

                return null;
              })}
            </GroupList>
          )
        }))}
      />
    </Wrap>
  );
};

interface IBloqGroupHandlerProps {
  group: IBloqTypeGroup;
  bloqTypes: IBloqType[];
  isOpen: boolean;
  onHandlerClick: React.MouseEventHandler;
  onTypeClick: (type: string) => any;
}

const BloqGroupHandler: React.FunctionComponent<IBloqGroupHandlerProps> = ({
  group,
  bloqTypes,
  isOpen,
  onHandlerClick,
  onTypeClick
}) => {
  const handlerType: IBloqType = {
    category: group.category,
    name: "handler",
    icon: group.icon,
    code: {},
    parameterDefinitions: []
  };

  const groupTypesStyle = useSpring({
    height: isOpen ? 200 : 0,
    from: { height: 0 },
    config: { tension: 600, friction: 40 }
  });

  const types = group.types.filter(t => bloqTypes.some(bt => bt.name === t));

  return (
    <Group>
      <GroupHandler onClick={onHandlerClick}>
        <HorizontalBloq type={handlerType} />
        <CollapseIndicator>{isOpen ? "-" : "+"}</CollapseIndicator>
      </GroupHandler>
      <GroupTypesWrap style={groupTypesStyle}>
        <GroupTypes>
          {types.map(typeName => (
            <StyledBloq
              key={typeName}
              type={bloqTypes.find(t => t.name === typeName)!}
              onClick={() => onTypeClick(typeName)}
            />
          ))}
        </GroupTypes>
      </GroupTypesWrap>
    </Group>
  );
};

export default AddBloqPanel;

/* styled components */

const Wrap = styled(animated.div)`
  overflow: hidden;
  display: flex;
`;

const Tabs = styled(ScrollableTabs)`
  min-width: 200px;
  border-left: 1px solid ${colors.gray3};
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-bottom: 20px;
`;

const GroupLabel = styled.div`
  align-self: flex-start;
  padding: 20px;
  font-size: 16px;
  font-weight: bold;
`;

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 140px;
  padding-bottom: 20px;
`;

const Group = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GroupHandler = styled.div`
  position: relative;
`;

const GroupTypesWrap = styled(animated.div)`
  overflow: hidden;
  width: 100%;
`;

const GroupTypes = styled.div`
  background-color: ${colors.gray2};
  padding-top: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &::before {
    content: "";
    background-color: ${colors.gray2};
    width: 12px;
    height: 12px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: -6px;
    left: 50%;
  }
`;

const CollapseIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: -2px;
  bottom: -6px;
  width: 24px;
  height: 24px;
  background-color: #d8d8d8;
  border: 1px solid #979797;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  z-index: 20;
`;
