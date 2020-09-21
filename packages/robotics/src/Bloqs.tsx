import React, { FC } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, Icon, Tabs, useTranslate } from "@bitbloq/ui";
import BloqCanvas from "./BloqCanvas";
import ExpandablePanel from "./ExpandablePanel";

const Bloqs: FC = () => {
  const t = useTranslate();

  return (
    <Container>
      <Main>
        <Toolbar>
          <ToolbarLeft>
            <ToolbarButton>
              <Icon name="undo" />
            </ToolbarButton>
            <ToolbarButton>
              <Icon name="redo" />
            </ToolbarButton>
          </ToolbarLeft>
          <ToolbarRight>
            <ToolbarGreenButton>
              <Icon name="tick" />
            </ToolbarGreenButton>
            <ToolbarGreenButton>
              <UploadIcon name="arrow" />
            </ToolbarGreenButton>
          </ToolbarRight>
        </Toolbar>
        <BloqsContent>
          <ExpandablePanel
            title={t("robotics.global-variables-and-functions")}
            startsOpen
          >
            <BloqCanvas />
          </ExpandablePanel>
          <ExpandablePanel title={t("robotics.setup-instructions")}>
            <BloqCanvas />
          </ExpandablePanel>
          <ExpandablePanel title={t("robotics.main-loop")}>
            <BloqCanvas />
          </ExpandablePanel>
        </BloqsContent>
      </Main>
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

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.gray3};
  height: 40px;
  padding: 0 20px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const ToolbarLeft = styled.div`
  display: flex;
  flex: 1;
`;

const ToolbarRight = styled.div`
  display: flex;
`;

const ToolbarButton = styled.div`
  width: 40px;
  background-color: #ebebeb;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  margin-right: -1px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 60px;
  }
`;

const ToolbarGreenButton = styled(ToolbarButton)`
  background-color: ${colors.green};
  color: white;
  border-color: white;
`;

const UploadIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const BloqsContent = styled.div`
  flex: 1;
  padding: 20px;
`;
