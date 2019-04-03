import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { colors, ScrollableTabs } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";
import HorizontalBloq from "./HorizontalBloq";

import { BloqCategory } from "../enums";
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

  const renderGroup = (group: IBloqTypeGroup, i: number) => {
    const types = group.types.filter(t => bloqTypes.some(bt => bt.name === t));

    if (types.length === 1 && !group.icon) {
      return (
        <StyledBloq
          key={i}
          type={bloqTypes.find(t => t.name === types[0])!}
          onClick={() => onTypeSelected(types[0])}
        />
      );
    }

    if (types.length > 0) {
      return (
        <BloqGroupHandler
          key={i}
          group={group}
          bloqTypes={bloqTypes}
          onTypeClick={onTypeSelected}
        />
      );
    }

    return null;
  };

  return (
    <Wrap style={wrapStyle} onClick={onClick}>
      <Tabs
        tabs={bloqTabs.map(tab => ({
          icon: tab.icon,
          content: (
            <GroupList>
              <GroupLabel>{tab.label}</GroupLabel>
              {tab.groups.map(renderGroup)}
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
  onTypeClick: (type: string) => any;
}

const BloqGroupHandler: React.FunctionComponent<IBloqGroupHandlerProps> = ({
  group,
  bloqTypes,
  onTypeClick
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const groupTypesEl = useRef<HTMLDivElement>(null);
  const groupsHeight = useRef<number>(0);

  useLayoutEffect(() => {
    if (groupTypesEl.current) {
      groupsHeight.current = groupTypesEl.current.clientHeight;
    }
  });

  const groupTypesStyle = useSpring({
    height: isOpen ? groupsHeight.current : 0,
    from: { height: 0 },
    config: { tension: 600, friction: 40 }
  });

  const types = group.types.filter(t => bloqTypes.some(bt => bt.name === t));

  return (
    <Group>
      <GroupHandler onClick={() => setIsOpen(!isOpen)}>
        <GroupIcon src={group.icon} />
        <CollapseIndicator>{isOpen ? "-" : "+"}</CollapseIndicator>
      </GroupHandler>
      <GroupTypesWrap style={groupTypesStyle}>
        <GroupTypes ref={groupTypesEl}>
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

const GroupIcon = styled.img`
  width: 60px;
  height: 60px;
  cursor: pointer;
`;

const GroupTypesWrap = styled(animated.div)`
  overflow: hidden;
  width: 100%;
`;

const GroupTypes = styled.div`
  background-color: ${colors.gray2};
  padding: 20px 0px;
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
