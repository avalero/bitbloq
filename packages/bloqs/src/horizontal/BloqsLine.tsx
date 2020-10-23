import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Icon, JuniorButton } from "@bitbloq/ui";
import HorizontalBloq from "./HorizontalBloq";
import BloqPlaceholder from "./BloqPlaceholder";

import { IBloq, IBloqLine, IBloqType } from "../index";
import { BloqCategory } from "../enums";

interface IBloqsLineProps {
  className?: string;
  line: IBloqLine;
  bloqTypes: IBloqType[];
  selectedBloq: number;
  selectedPlaceholder: number;
  activeBloq?: number;
  activeIndicator?: React.ReactNode;
  onBloqClick: (index: number, e: React.MouseEvent) => void;
  onPlaceholderClick: (index: number, e: React.MouseEvent) => void;
  getBloqPort: (bloq: IBloq) => string | undefined;
  onSelectedPositionChange: (scrollLeft: number) => void;
  editInPlace?: boolean;
  onDeleteBloq?: (index: number) => void;
  onUpdateBloq?: (index: number, newBloq: IBloq) => void;
  onShrinkLoop?: () => void;
  onGrowLoop?: () => void;
  readOnly?: boolean;
}

const BloqsLine: React.FunctionComponent<IBloqsLineProps> = ({
  className,
  line,
  bloqTypes,
  selectedBloq,
  selectedPlaceholder,
  activeBloq,
  activeIndicator,
  onBloqClick,
  onPlaceholderClick,
  getBloqPort,
  onSelectedPositionChange,
  editInPlace,
  onDeleteBloq,
  onUpdateBloq,
  onShrinkLoop,
  onGrowLoop,
  readOnly
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
    if (selectedElement && !editInPlace) {
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

      onSelectedPositionChange(offsetLeft - newScrollLeft);
    }

    setShowScrollLeft(newScrollLeft > 0);
    setShowScrollRight(bloqsWidth - newScrollLeft > containerWidth);
  };

  useEffect(() => {
    if (bloqs.length < 2) {
      updateScrollLeft(0);
    }
  }, [bloqs]);

  useEffect(() => {
    checkScroll();
  }, [bloqs, selectedPlaceholder, selectedBloq]);

  useEffect(() => {
    if (bloqsRef.current && containerRef.current && editInPlace) {
      const selectedElement = bloqsRef.current.querySelector(
        "[data-selected],[data-active=true]"
      );
      if (selectedElement) {
        const sl = scrollLeft.current || 0;
        const bloqsWidth = bloqsRef.current.clientWidth;
        const containerWidth = containerRef.current.clientWidth;
        const {
          x: selectedX,
          width: selectedWidth
        } = (selectedElement as HTMLElement).getBoundingClientRect();
        const { x: bloqsX } = bloqsRef.current.getBoundingClientRect();
        const offsetLeft = selectedX - bloqsX;

        if (offsetLeft + selectedWidth - sl > containerWidth) {
          updateScrollLeft(offsetLeft + selectedWidth - containerWidth + 80);
          setShowScrollLeft(true);
          setShowScrollRight(false);
        }
      }
    }
  }, [activeBloq, selectedPlaceholder]);

  useEffect(() => {
    setBloqsLeft(scrollLeft.current || 0);
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
    <Wrap className={className}>
      <Container ref={containerRef}>
        <Bloqs ref={bloqsRef} left={bloqsLeft}>
          {!readOnly && !startsWithEvent() && selectedPlaceholder !== 0 && (
            <BloqPlaceholder
              onClick={(e: React.MouseEvent) => onPlaceholderClick(0, e)}
              category={BloqCategory.Event}
            />
          )}
          {!readOnly && !startsWithEvent() && selectedPlaceholder === 0 && (
            <EmptyPlaceholder data-selected={true} />
          )}

          {groups.map((group, j) => {
            const isLoop = group[0] && group[0].type === "loop";

            return (
              <Group key={`bloq-group-${j}`}>
                {isLoop && <LoopBackground />}
                {group.map(bloq => {
                  const i = bloqs.indexOf(bloq);
                  const bloqType = bloqTypes.find(t => t.name === bloq.type);
                  return (
                    <React.Fragment key={i}>
                      {!readOnly &&
                        bloqs[i - 1] &&
                        selectedBloq === i - 1 &&
                        bloqs[i - 1].type === "end-loop" && (
                          <BloqPlaceholder
                            onClick={(e: React.MouseEvent) =>
                              onPlaceholderClick(i, e)
                            }
                            category={BloqCategory.Action}
                          />
                        )}
                      {selectedBloq !== i && (
                        <StyledBloq
                          type={bloqType}
                          onClick={(e: React.MouseEvent) => onBloqClick(i, e)}
                          bloq={bloq}
                          port={getBloqPort(bloq)}
                          disabled={line.disabled}
                          selectable={!readOnly}
                          active={activeBloq === i}
                          activeIndicator={activeIndicator}
                        />
                      )}
                      {editInPlace && selectedBloq === i && (
                        <SelectedWrap
                          isLoop={
                            bloq.type === "loop" ||
                            (bloq.type === "end-loop" &&
                              bloqs[i - 1].type !== "loop")
                          }
                          isFirst={i === 0}
                          canDelete={
                            !bloqType!.fixed &&
                            (bloq.type !== "end-loop" || i !== bloqs.length - 1)
                          }
                          data-selected={true}
                        >
                          {bloq.type === "loop" && (
                            <LoopButtonsWrap>
                              <LoopButton
                                tertiary
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
                                tertiary
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
                          {bloq.type === "end-loop" &&
                            bloqs[i - 1].type !== "loop" && (
                              <LeftEndLoopWrap>
                                <EndLoopButton
                                  secondary
                                  onClick={() => onShrinkLoop && onShrinkLoop()}
                                >
                                  <Icon name="angle" />
                                </EndLoopButton>
                              </LeftEndLoopWrap>
                            )}
                          <StyledBloq
                            type={bloqType}
                            bloq={bloq}
                            port={getBloqPort(bloq)}
                            disabled={line.disabled}
                            selectable={!readOnly}
                          />
                          {bloq.type === "end-loop" && i < bloqs.length - 1 && (
                            <RightEndLoopWrap>
                              <EndLoopButton
                                secondary
                                onClick={() => onGrowLoop && onGrowLoop()}
                              >
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
                      {selectedPlaceholder === i + 1 &&
                        !readOnly &&
                        (editInPlace ? (
                          <SelectedWrap data-selected={true}>
                            <BloqPlaceholder
                              selected={true}
                              category={BloqCategory.Action}
                            />
                          </SelectedWrap>
                        ) : (
                          <EmptyPlaceholder data-selected={true} />
                        ))}
                      {!readOnly &&
                        selectedBloq === i &&
                        bloq.type !== "end-loop" && (
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
          {!readOnly &&
            bloqs.length > 0 &&
            selectedPlaceholder !== bloqs.length &&
            (selectedBloq !== bloqs.length - 1 ||
              bloqs[bloqs.length - 1].type === "end-loop") && (
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
            <JuniorButton type="button" secondary onClick={onScrollLeft}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollLeftButton>
        )}
        {showScrollRight && (
          <ScrollRightButton>
            <JuniorButton type="button" secondary onClick={onScrollRight}>
              <Icon name="angle" />
            </JuniorButton>
          </ScrollRightButton>
        )}
      </Container>
    </Wrap>
  );
};

export default BloqsLine;

/* styled components */

const Wrap = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  height: 103px;
  background-color: #f1f1f1;
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
  z-index: 15;

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
  isLoop?: boolean;
  isFirst?: boolean;
  canDelete?: boolean;
}>`
  position: relative;
  padding: 10px;
  margin: 0px ${props => (props.canDelete ? 63 : 10)}px 0px
    ${props => {
      if (props.isFirst) {
        return 0;
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
