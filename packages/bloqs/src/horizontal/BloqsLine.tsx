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
  onUpdateBloq?: (index: number, newBloq: IBloq) => void;
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
  onDeleteBloq,
  onUpdateBloq
}) => {
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const scrollLeft = useRef<number | null>(0);
  const [bloqsLeft, setBloqsLeft] = useState(0);
  const bloqsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { bloqs } = line;

  const updateScrollLeft = (newScrollLeft: number) => {
    scrollLeft.current = newScrollLeft;
    setBloqsLeft(newScrollLeft);
    onScrollChange(newScrollLeft);
  };

  const checkScroll = () => {
    const sl = scrollLeft.current || 0;
    if (!bloqsRef.current || !containerRef.current) {
      return;
    }

    const bloqsWidth = bloqsRef.current.clientWidth;
    const containerWidth = containerRef.current.clientWidth;

    const selectedElement = bloqsRef.current.querySelector("[data-selected]");
    let newScrollLeft = sl;
    if (selectedElement) {
      const {
        x: selectedX,
        width: selectedWidth
      } = (selectedElement as HTMLElement).getBoundingClientRect();
      const { x: bloqsX } = bloqsRef.current.getBoundingClientRect();
      const offsetLeft = selectedX - bloqsX;

      if (offsetLeft + selectedWidth - sl > containerWidth) {
        newScrollLeft = offsetLeft + selectedWidth - containerWidth + 80;
        updateScrollLeft(newScrollLeft);
      } else if (offsetLeft - sl < 0) {
        newScrollLeft = offsetLeft - 80;
        updateScrollLeft(newScrollLeft);
      }
    }

    setShowScrollLeft(newScrollLeft > 0);
    setShowScrollRight(bloqsWidth - newScrollLeft > containerWidth);
  };

  useEffect(() => {
    checkScroll();
  }, [bloqs]);

  useEffect(() => {
    setBloqsLeft(scrollLeft.current || 0);
    onScrollChange(scrollLeft.current || 0);
  }, [scrollLeft.current]);

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
    const newScrollLeft = Math.max((scrollLeft.current || 0) - 100, 0);
    updateScrollLeft(newScrollLeft);
    checkScroll();
  };

  const onScrollRight = () => {
    if (!bloqsRef.current || !containerRef.current) {
      return;
    }
    const containerWidth = containerRef.current.clientWidth;
    const bloqsWidth = bloqsRef.current.clientWidth;
    const newScrollLeft = Math.min(
      (scrollLeft.current || 0) + 100,
      bloqsWidth - containerWidth
    );
    updateScrollLeft(newScrollLeft);
    checkScroll();
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
      <Bloqs ref={bloqsRef} left={bloqsLeft}>
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
              {isLoop && (
                <LoopBackground
                  endLoopSelected={endLoopSelected}
                  lastGroup={j === groups.length - 1}
                  nextPlaceholder={
                    selectedPlaceholder === bloqs.indexOf(groupLastBloq) + 1
                  }
                />
              )}
              {group.map(bloq => {
                const i = bloqs.indexOf(bloq);
                const bloqType = bloqTypes.find(t => t.name === bloq.type);
                return (
                  <React.Fragment key={i}>
                    {selectedBloq !== i && (
                      <StyledBloq
                        type={bloqType}
                        onClick={(e: React.MouseEvent) => onBloqClick(i, e)}
                        bloq={bloq}
                        port={getBloqPort(bloq)}
                        disabled={line.disabled}
                      />
                    )}
                    {editInPlace && selectedBloq === i && (
                      <SelectedWrap
                        isLoop={
                          bloq.type === "loop" || bloq.type === "end-loop"
                        }
                        isFirst={i === 0}
                        canDelete={
                          (!bloqType!.fixed && bloq.type !== "end-loop") ||
                          i !== bloqs.length - 1
                        }
                        data-selected={true}
                      >
                        {bloq.type === "loop" && (
                          <LoopButtonsWrap>
                            <LoopButton
                              secondary
                              onClick={() => {
                                if (!onUpdateBloq) {
                                  return;
                                }
                                if (bloq.parameters.repeat < 9) {
                                  onUpdateBloq(i, {
                                    ...bloq,
                                    parameters: {
                                      ...bloq.parameters,
                                      repeat:
                                        (bloq.parameters.repeat as number) + 1
                                    }
                                  });
                                }
                              }}
                            >
                              <Icon name="plus" />
                            </LoopButton>
                            <LoopButton
                              secondary
                              onClick={() => {
                                if (!onUpdateBloq) {
                                  return;
                                }
                                if (bloq.parameters.repeat > 2) {
                                  onUpdateBloq(i, {
                                    ...bloq,
                                    parameters: {
                                      ...bloq.parameters,
                                      repeat:
                                        (bloq.parameters.repeat as number) - 1
                                    }
                                  });
                                }
                              }}
                            >
                              <Icon name="minus" />
                            </LoopButton>
                          </LoopButtonsWrap>
                        )}
                        {bloq.type === "end-loop" && (
                          <LeftEndLoopWrap>
                            <EndLoopButton secondary>
                              <Icon name="angle" />
                            </EndLoopButton>
                          </LeftEndLoopWrap>
                        )}
                        <StyledBloq
                          type={bloqType}
                          bloq={bloq}
                          port={getBloqPort(bloq)}
                          disabled={line.disabled}
                        />
                        {bloq.type === "end-loop" && i < bloqs.length - 1 && (
                          <RightEndLoopWrap>
                            <EndLoopButton secondary>
                              <Icon name="angle" />
                            </EndLoopButton>
                          </RightEndLoopWrap>
                        )}
                        {!bloqType!.fixed && bloq.type !== "end-loop" && (
                          <DeleteWrap>
                            <DeleteButton
                              red
                              onClick={() => onDeleteBloq && onDeleteBloq(i)}
                            >
                              <Icon name="trash" />
                            </DeleteButton>
                          </DeleteWrap>
                        )}
                      </SelectedWrap>
                    )}
                    {!editInPlace && selectedBloq === i && (
                      <EmptyBloq data-selected={true} />
                    )}
                    {selectedPlaceholder === i + 1 && (
                      <EmptyPlaceholder data-selected={true} />
                    )}
                    {selectedBloq === i && (
                      <BloqPlaceholder
                        isLoop={isLoop && !endLoopSelected}
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
        {selectedBloq !== bloqs.length - 1 && (
          <BloqPlaceholder
            onClick={(e: React.MouseEvent) =>
              onPlaceholderClick(bloqs.length, e)
            }
            category={BloqCategory.Action}
          />
        )}
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

const LoopBackground = styled.div<{
  endLoopSelected: boolean;
  lastGroup: boolean;
  nextPlaceholder: boolean;
}>`
  background-color: #4d2e6a;
  position: absolute;
  left: 40px;
  right: ${props => {
    if (props.nextPlaceholder) {
      return 140;
    } else if (props.endLoopSelected) {
      if (props.lastGroup) {
        return 73;
      } else {
        return 180;
      }
    } else {
      return 20;
    }
  }}px;
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
    ${props => {
      if (props.isFirst) {
        return -10;
      } else if (props.isLoop) {
        return 57;
      } else {
        return 10;
      }
    }}px;
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

const LeftEndLoopWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  padding: 10px;
  transform: translate(-100%, -50%);
  background: white;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  svg {
    transform: rotate(90deg);
  }
`;

const RightEndLoopWrap = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  padding: 10px;
  transform: translate(100%, -50%);
  background: white;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  svg {
    transform: rotate(-90deg);
  }
`;

const EndLoopButton = styled(JuniorButton)`
  padding: 10px;
  width: 40px;
  height: 40px;
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
