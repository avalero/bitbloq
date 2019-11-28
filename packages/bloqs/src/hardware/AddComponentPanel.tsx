import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { breakpoints, colors, Icon, JuniorButton } from "@bitbloq/ui";
import { motion } from "framer-motion";

import { IBoard, IComponent } from "../index";

export interface IAddComponentPanelProps {
  isOpen: boolean;
  board: IBoard;
  components: IComponent[];
  onComponentSelected: (component: IComponent) => any;
}

const AddComponentPanel: React.FunctionComponent<IAddComponentPanelProps> = ({
  isOpen,
  board,
  components,
  onComponentSelected
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const onScroll = () => {
    if (!contentRef.current) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    setShowScrollTop(scrollTop > 0);
    setShowScrollBottom(scrollTop + clientHeight < scrollHeight);
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.addEventListener("scroll", onScroll);
    }
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    onScroll();
  }, [isOpen]);

  const onScrollTop = () => {
    if (!contentRef.current) {
      return;
    }

    let newScrollTop = 0;
    let i = 0;
    const { scrollTop } = contentRef.current;
    while (
      i < components.length &&
      newScrollTop + components[i].image.height + 30 < scrollTop + 57
    ) {
      newScrollTop += components[i].image.height + 30;
      i++;
    }
    newScrollTop -= 57;
    contentRef.current.scrollTop = newScrollTop;
  };

  const onScrollBottom = () => {
    if (!contentRef.current) {
      return;
    }

    let newScrollTop = 0;
    let i = 0;
    const { scrollTop, clientHeight } = contentRef.current;
    while (
      i < components.length &&
      newScrollTop + components[i].image.height + 30 <=
        scrollTop + clientHeight - 57
    ) {
      newScrollTop += components[i].image.height + 30;
      i++;
    }
    newScrollTop += components[i].image.height + 100;
    contentRef.current.scrollTop = newScrollTop - clientHeight;
  };

  return (
    <Wrap animate={{ width: isOpen ? "auto" : 0 }}>
      {showScrollTop && (
        <ScrollTopButton>
          <JuniorButton secondary onClick={onScrollTop}>
            <Icon name="angle" />
          </JuniorButton>
        </ScrollTopButton>
      )}
      <Content ref={contentRef}>
        {components.map(
          (component, i) =>
            component.image && (
              <Component
                key={i}
                width={component.image.width}
                height={component.image.height}
                onClick={() => onComponentSelected(component)}
              >
                <img src={component.image.url} />
              </Component>
            )
        )}
      </Content>
      {showScrollBottom && (
        <ScrollBottomButton>
          <JuniorButton secondary onClick={onScrollBottom}>
            <Icon name="angle" />
          </JuniorButton>
        </ScrollBottomButton>
      )}
    </Wrap>
  );
};

function isCompatible(component: IComponent, board: IBoard) {
  return true;
}

export default AddComponentPanel;

/* styled components */

const Wrap = styled(motion.div)`
  position: relative;
  overflow: hidden;
  display: flex;
`;

const ScrollButton = styled.div`
  position: absolute;
  width: 100%;
  height: 60px;
  background-color: rgba(55, 59, 68, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    width: 40px;
    height: 40px;
    padding: 0px;

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ScrollTopButton = styled(ScrollButton)`
  top: 0px;
  svg {
    transform: rotate(180deg);
  }
`;

const ScrollBottomButton = styled(ScrollButton)`
  bottom: 0px;
`;

const Content = styled.div`
  display: flex;
  border-left: 1px solid ${colors.gray3};
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
  scroll-behavior: smooth;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    padding: 20px;
  }
`;

const Component = styled.div<{ width: number; height: number }>`
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 10px;
  background-color: #f1f1f1;
  box-shadow: 0 3px 0 0 #bbb;
  img {
    display: block;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
  }

  &:last-of-type {
    margin-bottom: 0px;
  }
`;
