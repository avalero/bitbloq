import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "../colors";
import breakpoints from "../breakpoints";

export interface ITabsProps {
  tabs: Array<{
    icon: React.ReactNode;
    content: React.ReactNode;
    color?: string;
    label: string;
  }>;
  currentTab?: number;
  onTabChange?: (newTab: number) => void;
  className?: string;
}

const Tabs: React.FunctionComponent<ITabsProps> = ({
  className,
  currentTab,
  onTabChange,
  tabs
}) => {
  const [activeTab, setActiveTab] = useState(currentTab || -1);

  useEffect(() => {
    if (currentTab !== undefined && onTabChange) {
      setActiveTab(currentTab);
    }
  }, [currentTab, onTabChange]);

  return (
    <Container className={className} isOpen={activeTab >= 0}>
      <TabsContainer isOpen={activeTab >= 0}>
        {tabs.map((tab, i) => (
          <Tab key={i} onClick={() => setActiveTab(i)}>
            <TabIcon active={i === activeTab} color={tab.color || "#b9bdc8"}>
              {tab.icon}
            </TabIcon>
            {activeTab < 0 && tab.label}
          </Tab>
        ))}
      </TabsContainer>
      {activeTab >= 0 && <Content>{tabs[activeTab].content}</Content>}
    </Container>
  );
};

export default Tabs;

/* styled components */

const Container = styled.div<{ isOpen: boolean }>`
  display: flex;
  background-color: white;
  min-width: 180px;
  flex: ${props => (props.isOpen ? 1 : "inherit")};

  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-width: 200px;
  }
`;

const TabsContainer = styled.div<{ isOpen: boolean }>`
  width: ${props => (props.isOpen ? "40px" : "100%")};

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: ${props => (props.isOpen ? "50px" : "100%")};
  }
`;

const Tab = styled.div`
  cursor: pointer;
  height: 40px;
  display: flex;
  border-bottom: 1px solid ${colors.gray3};
  font-size: 14px;
  align-items: center;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const TabIcon = styled.div<{ active: boolean; color: string }>`
  flex-shrink: 0;
  background-color: ${props => (props.active ? "white" : props.color)};
  margin-right: 12px;
  width: 40px;
  height: 40px;
  color: ${props => (props.active ? props.color : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-right: ${props => (props.active ? "1px solid white" : "none")};
  font-size: 14px;
  font-weight: bold;

  svg {
    width: 24px;
    height: 24px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
`;

const Content = styled.div`
  border-left: 1px solid ${colors.gray3};
`;
