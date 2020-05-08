import React, { FC } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, Icon, Tabs, useTranslate } from "@bitbloq/ui";

const Bloqs: FC = () => {
  const t = useTranslate();

  return (
    <Container>
      <Canvas>
      </Canvas>
      <Tabs
        tabs={[
          {
            icon: <Icon name="led-on" />,
            label: t("robotics.components"),
            content: <div>Components</div>,
            color: "#ce1c23"
          },
          {
            icon: "FUN",
            label: t("robotics.functions"),
            content: <div>Functions</div>,
            color: "#dd5b0c"
          }
        ]}
      />
    </Container>
  );
};

export default Bloqs;

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Canvas = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
