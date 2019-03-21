import React from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import { useSpring, animated } from "react-spring";

import { IComponent, IComponentInstance } from "./index.d";

interface IComponentPropertiesPanelProps {
  isOpen: boolean;
  components: IComponent[];
  componentInstance: IComponentInstance;
}

const ComponentPropertiesPanel: React.FunctionComponent<
  IComponentPropertiesPanelProps
  > = ({ isOpen, components, componentInstance = {}}) => {
  const wrapStyle = useSpring({
    width: isOpen ? 300 : 0,
    from: { width: 0 },
    config: { tension: 600, friction: 40 }
  });

  const component = components.find(
    c => c.name === componentInstance.component
  );

  return (
    <Wrap style={wrapStyle}>
      <Content>
        <Header>
          <Title>{componentInstance.component}</Title>
        </Header>
      </Content>
    </Wrap>
  );
};

export default ComponentPropertiesPanel;

/* styled components */

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

const Title = styled.div`
  font-size: 13px;
  font-weight: bold;
  font-style: italic;
  margin-left: 10px;
  flex: 1;
`;
