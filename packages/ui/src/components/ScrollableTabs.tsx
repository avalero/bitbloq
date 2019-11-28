import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import colors from "../colors";

export interface IScrollableTabsProps {
  tabs: Array<{ icon: JSX.Element; content: JSX.Element; bottom?: boolean }>;
  className?: string;
}

const ScrollableTabs: React.FunctionComponent<IScrollableTabsProps> = ({
  className,
  tabs
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const contentEl = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!contentEl.current) {
      return;
    }
    const el = contentEl.current!;
    const scrollTop = el.scrollTop;
    const visibleTab = Array.from(el.children).reduce(
      (tab, child: HTMLDivElement, i) =>
        child.offsetTop - scrollTop < 200 ? i : tab,
      0
    );
    setActiveTab(visibleTab);
  };

  const onSelectTab = (tab: number) => {
    const el = contentEl.current!;
    const scrollTop = (el.children[tab] as HTMLDivElement).offsetTop;
    el.scrollTop = scrollTop;
    setActiveTab(tab);
  };

  return (
    <Container className={className}>
      <Tabs>
        {tabs.map((tab, i) => (
          <Tab
            key={i}
            active={i === activeTab}
            bottom={!!tab.bottom}
            onClick={() => onSelectTab(i)}
          >
            {tab.icon}
          </Tab>
        ))}
      </Tabs>
      <Content ref={contentEl} onScroll={onScroll}>
        {tabs.map((tab, i) => (
          <div key={i}>{tab.content}</div>
        ))}
      </Content>
    </Container>
  );
};

export default ScrollableTabs;

/* styled components */

const Container = styled.div`
  display: flex;
  background-color: white;
`;

const Tabs = styled.div`
  width: 60px;
  border-right: 1px solid ${colors.gray3};
  position: relative;
`;

const Tab = styled.div<{ active: boolean; bottom: boolean }>`
  border-top: ${props => (props.bottom ? `1px solid ${colors.gray3}` : "")};
  height: 60px;
  width: 60px;
  border-bottom: 1px solid white;
  background-color: #b9bdc8;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: ${props => (props.bottom ? "absolute" : "relative")};
  bottom: 0;

  svg {
    width: 24px;
    height: 24px;
  }

  ${props =>
    props.active &&
    css`
      background-color: white;
      color: ${colors.gray3};
      border-right: 1px solid white;
      border-bottom: 1px solid ${colors.gray3};
    `}

  border-bottom-width: ${props => (props.bottom ? 0 : 1)}px;
`;

const Content = styled.div`
  overflow-y: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;
