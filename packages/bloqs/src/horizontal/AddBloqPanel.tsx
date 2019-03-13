import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";
import HorizontalBloq from "./HorizontalBloq";

import { BloqTypeGroup, BloqType } from "../index.d";

interface AddBloqPanelProps {
  isOpen: boolean;
  bloqTypeGroups: BloqTypeGroup[];
  bloqTypes: BloqType[];
  onTypeSelected: (type: string) => any;
  onClick?: React.MouseEventHandler;
}

const AddBloqPanel: React.FunctionComponent<AddBloqPanelProps> = ({
  isOpen,
  bloqTypeGroups,
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
      <Container>
        <GroupList>
          {bloqTypeGroups.map((group, i) => {
            if (group.types.length === 1) {
              return (
                <StyledBloq
                  key={i}
                  type={bloqTypes.find(t => t.name === group.types[0])!}
                  onClick={() => onTypeSelected(group.types[0])}
                />
              );
            }

            if (group.types.length > 1) {
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
      </Container>
    </Wrap>
  );
};

interface BloqGroupHandlerProps {
  group: BloqTypeGroup;
  bloqTypes: BloqType[];
  isOpen: boolean;
  onHandlerClick: React.MouseEventHandler;
  onTypeClick: (type: string) => any;
}

const BloqGroupHandler: React.FunctionComponent<BloqGroupHandlerProps> = ({
  group,
  bloqTypes,
  isOpen,
  onHandlerClick,
  onTypeClick
}) => {
  const handlerType: BloqType = {
    category: group.category,
    name: "handler",
    icon: group.icon,
    code: {}
  };

  const groupTypesStyle = useSpring({
    height: isOpen ? 200 : 0,
    from: { height: 0 },
    config: { tension: 600, friction: 40 }
  });

  return (
    <Group>
      <GroupHandler onClick={onHandlerClick}>
        <HorizontalBloq type={handlerType} />
        <CollapseIndicator>{isOpen ? "-" : "+"}</CollapseIndicator>
      </GroupHandler>
      <GroupTypesWrap style={groupTypesStyle}>
        <GroupTypes>
          {group.types.map(typeName => (
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

const Container = styled.div`
  min-width: 200px;
  border-left: 1px solid ${colors.gray3};
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-bottom: 20px;
`;

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
`;
