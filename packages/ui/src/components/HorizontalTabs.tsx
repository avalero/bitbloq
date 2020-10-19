import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import colors from "../colors";

export interface IHorizontalTabsProps {
  tabs: Array<{ content: React.ReactNode; label: string }>;
  currentTab?: number;
  onTabChange?: (newTab: number) => void;
  className?: string;
}

const HorizontalTabs: FC<IHorizontalTabsProps> = ({
  tabs,
  currentTab,
  onTabChange,
  className
}) => {
  const [activeTab, setActiveTab] = useState(currentTab || 0);

  useEffect(() => {
    if (currentTab !== undefined && onTabChange) {
      setActiveTab(currentTab);
    }
  }, [currentTab, onTabChange]);

  return (
    <Container className={className}>
      <TabsContainer>
        {tabs.map((tab, i) => (
          <Tab key={i} onClick={() => setActiveTab(i)} active={activeTab === i}>
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>
      {activeTab >= 0 && tabs[activeTab] && (
        <div>{tabs[activeTab].content}</div>
      )}
    </Container>
  );
};

export default HorizontalTabs;

const Container = styled.div``;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.gray3};
  padding: 0 20px;
`;

const Tab = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 40px;
  display: flex;
  font-size: 14px;
  align-items: center;
  background-color: ${props => (props.active ? "white" : colors.gray2)};
  border: 1px solid ${colors.gray3};
  flex: 1;
  justify-content: center;
  font-weight: bold;
  margin-right: -1px;
  margin-bottom: -1px;
  border-bottom-color: ${props => (props.active ? "white" : colors.gray3)};
  color: ${props => (props.active ? colors.black : colors.blackHover)};
`;
