import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";
import HorizontalBloq from "./HorizontalBloq";

import { Bloq, BloqType } from "../index.d";

interface BloqPropertiesPanelProps {
  isOpen: boolean;
  bloqType: BloqType;
  bloq: Bloq;
}

const BloqPropertiesPanel: React.FunctionComponent<
  BloqPropertiesPanelProps
> = ({ isOpen, bloqType, bloq }) => {
  const wrapStyle = useSpring({
    width: isOpen ? 300 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  if (!bloqType) {
    return null;
  }

  return (
    <Wrap style={wrapStyle}>
      <Content>
        <Header>
          <HeaderBloq>
            <HorizontalBloq type={bloqType} />
          </HeaderBloq>
          <Title>{bloqType.label}</Title>
        </Header>
      </Content>
    </Wrap>
  );
};

export default BloqPropertiesPanel;

/* styled componets */

const Wrap = styled(animated.div)`
  overflow: hidden;
  display: flex;
`;

const Content = styled.div`
  min-width: 300px;
  border-left: 1px solid ${colors.gray3};
`;

const Header = styled.div`
  height: 50px;
  border-bottom: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  padding: 0px 20px;
`;

const HeaderBloq = styled.div`
  transform: scale(0.5);
  width: 30px;
  margin-left: -8px;
  margin-right: 8px;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  margin-left: 10px;
  flex: 1;
`;
