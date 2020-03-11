import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { colors, Icon, JuniorButton } from "@bitbloq/ui";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";

import { IBloq, IBloqLine, IBloqType } from "../index";
import { BloqCategory } from "../enums";

interface IBloqsLineProps {
  line: IBloqLine;
  bloqTypes: IBloqType[];
  selectedBloq: number;
  selectedPlaceholder: number;
  onBloqClick: (index: number, e: React.MouseEvent) => void;
  onPlaceholderClick: (index: number, e: React.MouseEvent) => void;
  getBloqPort: (bloq: IBloq) => string | undefined;
  onScrollChange: (scrollLeft: number) => void;
  editInPlace?: boolean;
  onDeleteBloq?: (index: number) => void;
}

const BloqsLine: React.FunctionComponent<IBloqsLineProps> = ({
  line,
  bloqTypes,
  selectedBloq,
  selectedPlaceholder,
  onBloqClick,
  onPlaceholderClick,
  getBloqPort,
  onScrollChange,
  editInPlace,
  onDeleteBloq
}) => {
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(0);
  const bloqsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { bloqs } = line;

  const checkScroll = () => {
    if (!bloqsRef.current || !containerRef.current) {
      return;
    }

    const bloqsWidth = bloqsRef.current.clientWidth;
    const containerWidth = containerRef.current.clientWidth;

    setShowScrollLeft(scrollLeft > 0);
    setShowScrollRight(bloqsWidth - scrollLeft > containerWidth);

    const selectedElement = bloqsRef.current.querySelector("[data-selected]");
    if (selectedElement) {
      const { offsetLeft, clientWidth } = selectedElement as HTMLElement;

      if (offsetLeft + clientWidth - scrollLeft > containerWidth) {
        const newScrollLeft = offsetLeft + clientWidth - containerWidth + 80;
        setScrollLeft(newScrollLeft);
      } else if (offsetLeft - scrollLeft < 0) {
        const newScrollLeft = offsetLeft - 80;
        setScrollLeft(newScrollLeft);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  useEffect(() => {
    checkScroll();
    onScrollChange(scrollLeft);
  }, [bloqs, scrollLeft]);

  const startsWithEvent = () => {
    if (!bloqs[0]) {
      return false;
    }

    const bloqType = bloqTypes.find(t => t.name === bloqs[0].type);
    return bloqType && bloqType.category === BloqCategory.Event;
  };

  const onScrollLeft = () => {
    if (!bloqsRef.current) {
      return;
    }
    const newScrollLeft = Math.max(scrollLeft - 100, 0);
    setScrollLeft(newScrollLeft);
  };

  const onScrollRight = () => {
    if (!bloqsRef.current || !containerRef.current) {
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const bloqsWidth = bloqsRef.current.clientWidth;
    const newScrollLeft = Math.min(
      scrollLeft + 100,
      bloqsWidth - containerWidth
    );
    setScrollLeft(newScrollLeft);
  };

  const groups = bloqs.reduce(
    (acc, bloq) => {
      if (bloq.type === "loop") {
        return [...acc, [bloq]];
      } else if (bloq.type === "end-loop") {
        const lastGroup = acc.pop() as [];
        return [...acc, [...lastGroup, bloq], []];
      } else {
        const lastGroup = acc.pop() as [];
        return [...acc, [...lastGroup, bloq]];
      }
    },
    [[]]
  );

  return (
    <Container ref={containerRef}>
      <Bloqs ref={bloqsRef} left={scrollLeft}>
        {!startsWithEvent() && selectedPlaceholder !== 0 && (
          <BloqPlaceholder
            onClick={(e: React.MouseEvent) => onPlaceholderClick(0, e)}
            category={BloqCategory.Event}
          />
        )}

        {groups.map((group, j) => {
          const isLoop = group[0] && group[0].type === "loop";
          const groupLastBloq = group[group.length - 1];
          const endLoopSelected =
            groupLastBloq &&
            groupLastBloq.type === "end-loop" &&
            bloqs.indexOf(groupLastBloq) === selectedBloq;

          return (
            <Group key={`bloq-group-${j}`}>
              {isLoop && <LoopBackground />}
              {group.map(bloq => {
                const i = bloqs.indexOf(bloq);
                return (
                  <React.Fragment key={i}>
                    {selectedBloq !== i && (
                      <StyledBloq
                        type={bloqTypes.find(t => t.name === bloq.type)}
                        onClick={(e: React.MouseEvent) => onBloqClick(i, e)}
                        bloq={bloq}
                        port={getBloqPort(bloq)}
                        disabled={line.disabled}
                      />
                    )}
                    {editInPlace && selectedBloq === i && (
                      <SelectedWrap
                        isLoop={bloq.type === "loop"}
                        isFirst={i === 0}
                        canDelete={true}
                        data-selected={true}
                      >
                        {bloq.type === "loop" && (
                          <LoopButtonsWrap>
                            <LoopButton secondary>
                              <Icon name="plus" />
                            </LoopButton>
                            <LoopButton secondary>
                              <Icon name="minus" />
                            </LoopButton>
                          </LoopButtonsWrap>
                        )}
                        <StyledBloq
                          type={bloqTypes.find(t => t.name === bloq.type)}
                          bloq={bloq}
                          port={getBloqPort(bloq)}
                          disabled={line.disabled}
                        />
                        <DeleteWrap>
                          <DeleteButton
                            red
                            onClick={() => onDeleteBloq && onDeleteBloq(i)}
                          >
                            <Icon name="trash" />
                          </DeleteButton>
                        </DeleteWrap>
                      </SelectedWrap>
                    )}
                    {!editInPlace && selectedBloq === i && (
                      <EmptyBloq data-selected={true} />
                    )}
                    {selectedPlaceholder === i + 1 && (
                      <EmptyPlaceholder data-selected={true} />
                    )}
                    {!endLoopSelected && selectedBloq === i && (
                      <BloqPlaceholder
                        isLoop={isLoop}
                        onClick={(e: React.MouseEvent) =>
                          onPlaceholderClick(i + 1, e)
                        }
                        category={BloqCategory.Action}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </Group>
          );
        })}
        <BloqPlaceholder
          onClick={(e: React.MouseEvent) => onPlaceholderClick(bloqs.length, e)}
          category={BloqCategory.Action}
        />
      </Bloqs>
      {showScrollLeft && (
        <ScrollLeftButton>
          <JuniorButton secondary onClick={onScrollLeft}>
            <Icon name="angle" />
          </JuniorButton>
        </ScrollLeftButton>
      )}
      {showScrollRight && (
        <ScrollRightButton>
          <JuniorButton secondary onClick={onScrollRight}>
            <Icon name="angle" />
          </JuniorButton>
        </ScrollRightButton>
      )}
    </Container>
  );
};

export default BloqsLine;

/* styled components */

const Container = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 103px;
  background-color: #f1f1f1;
  overflow: hidden;
`;

const Bloqs = styled.div<{ left: number }>`
  position: absolute;
  transform: translate(-${props => props.left}px, 0);
  top: 0px;
  left: 0px;
  display: flex;
  flex: 1;
  align-items: center;
  padding-right: 80px;
  padding: 10px;
  height: 103px;
  box-sizing: border-box;
  overflow: hidden;
`;

const Group = styled.div`
  height: 103px;
  display: flex;
  align-items: center;
  position: relative;
`;

const LoopBackground = styled.div`
  background-color: #4d2e6a;
  position: absolute;
  left: 40px;
  right: 20px;
  top: 0px;
  bottom: 0px;
  border-radius: 10px;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-right: 2px;
  flex-shrink: 0;
`;

const EmptyBloq = styled.div`
  flex-shrink: 0;
  width: 156px;
  height: 83px;
  margin-left: 5px;
  margin-right: 10px;
  &:first-of-type {
    margin-left: 0px;
  }
`;

const EmptyPlaceholder = styled(EmptyBloq)`
  width: 106px;
`;

const ScrollButton = styled.div`
  position: absolute;
  width: 60px;
  height: 100%;
  background-color: rgba(55, 59, 68, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;

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

const ScrollLeftButton = styled(ScrollButton)`
  left: 0px;
  svg {
    transform: rotate(90deg);
  }
`;

const ScrollRightButton = styled(ScrollButton)`
  right: 0px;
  svg {
    transform: rotate(-90deg);
  }
`;

const SelectedWrap = styled.div<{
  isLoop: boolean;
  isFirst: boolean;
  canDelete: boolean;
}>`
  position: relative;
  padding: 10px;
  margin: 0px ${props => (props.canDelete ? 63 : 10)}px 0px
    ${props => (props.isFirst ? -10 : props.isLoop ? 57 : 10)}px;
  background-color: white;
  border-radius: 6px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
`;

const LoopButtonsWrap = styled.div`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 10px;
  padding: 10px;
  transform: translate(-100%, 0);
  background: white;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
`;

const LoopButton = styled(JuniorButton)`
  padding: 6px 10px;
  width: 40px;
  height: 34px;
  margin-bottom: 12px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const DeleteWrap = styled.div`
  position: absolute;
  top: 0px;
  right: 10px;
  transform: translate(100%, 0);
  background: white;
  padding: 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const DeleteButton = styled(JuniorButton)`
  padding: 10px;
  width: 40px;
  height: 40px;
  svg {
    width: 20px;
    height: 20px;
  }
`;
