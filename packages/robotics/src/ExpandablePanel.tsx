import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Icon } from "@bitbloq/ui";

export interface IExpandablePanelProps {
  startsOpen?: boolean;
  title: string;
}

const ExpandablePanel: FC<IExpandablePanelProps> = ({
  children,
  startsOpen = false,
  title
}) => {
  const [open, setOpen] = useState<boolean>(startsOpen);
  const [height, setHeight] = useState<number>(0);
  const [animated, setAnimated] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (open) {
        const { height } = contentRef.current.getBoundingClientRect();
        setTimeout(() => setHeight(height), 0);
      } else {
        setTimeout(() => setHeight(0), 0);
      }
    }
  }, [open]);

  return (
    <Container>
      <Header onClick={() => (setOpen(!open), setAnimated(true))}>
        <Toggle>
          <ToggleIcon name="angle" open={open} />
        </Toggle>
        <Title>
          <span>{title}</span>
        </Title>
      </Header>
      <ContentWrap
        onTransitionEnd={() => setAnimated(false)}
        style={{
          height: animated ? height : open ? "auto" : 0
        }}
      >
        <div ref={contentRef}>{children}</div>
      </ContentWrap>
    </Container>
  );
};

export default ExpandablePanel;

const Container = styled.div`
  border-radius: 3px;
  border: 2px solid #ebebeb;
  background-color: white;
  overflow: hidden;
  margin-bottom: 20px;
`;

const Header = styled.div`
  height: 40px;
  display: flex;
  cursor: pointer;
  background-color: #ebebeb;
`;

const Toggle = styled.div`
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleIcon = styled(Icon)<{ open?: boolean }>`
  transform: rotate(${props => (props.open ? 0 : -90)}deg);
  transition: transform 0.5s ease;
`;

const Title = styled.div`
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  overflow: hidden;
  flex: 1;

  span {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const ContentWrap = styled.div`
  transition: height 0.5s ease;
  overflow: hidden;
`;
