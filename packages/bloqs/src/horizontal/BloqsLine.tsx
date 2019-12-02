import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Icon, JuniorButton } from "@bitbloq/ui";
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
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (line: IBloqLine) => void;
  onMoveDown: (line: IBloqLine) => void;
  onDuplicate: (line: IBloqLine) => void;
  onToggle: (line: IBloqLine) => void;
  onDelete: (line: IBloqLine) => void;
  onScrollChange: (scrollLeft: number) => void;
}

const BloqsLine: React.FunctionComponent<IBloqsLineProps> = ({
  line,
  bloqTypes,
  selectedBloq,
  selectedPlaceholder,
  onBloqClick,
  onPlaceholderClick,
  getBloqPort,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onToggle,
  onDelete,
  onScrollChange
}) => {
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const bloqsRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const showOptionsRef = useRef<HTMLButtonElement>(null);

  const { bloqs } = line;

  const onScroll = () => {
    if (!bloqsRef.current) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = bloqsRef.current;
    setShowScrollLeft(scrollLeft > 0);
    setShowScrollRight(scrollLeft + clientWidth < scrollWidth);
    onScrollChange(scrollLeft);
  };

  const onDocumentClick = (event: MouseEvent) => {
    if (
      optionsRef.current &&
      !optionsRef.current.contains(event.target as Node) &&
      showOptionsRef.current &&
      !showOptionsRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    if (bloqsRef.current) {
      bloqsRef.current.addEventListener("scroll", onScroll);
    }
    window.addEventListener("resize", onScroll);
    document.addEventListener("mousedown", onDocumentClick);
    onScroll();
    return () => {
      if (bloqsRef.current) {
        bloqsRef.current.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("mousedown", onDocumentClick);
    };
  }, []);

  const startsWithEvent = () => {
    if (!bloqs[0]) {
      return false;
    }

    const bloqType = bloqTypes.find(t => t.name === bloqs[0].type);
    return bloqType && bloqType.category === BloqCategory.Event;
  };

  const onScrollLeft = () => {
    console.log("Scroll left");
  };

  const onScrollRight = () => {
    console.log("Scroll right");
  };

  return (
    <>
      <Container>
        <Bloqs ref={bloqsRef}>
          {!startsWithEvent() && selectedPlaceholder !== 0 && (
            <BloqPlaceholder
              onClick={(e: React.MouseEvent) => onPlaceholderClick(0, e)}
              category={BloqCategory.Event}
            />
          )}
          {bloqs.map((bloq, i) => (
            <React.Fragment key={i}>
              {selectedBloq !== i && (
                <StyledBloq
                  type={bloqTypes.find(t => t.name === bloq.type)!}
                  onClick={(e: React.MouseEvent) => onBloqClick(i, e)}
                  bloq={bloq}
                  port={getBloqPort(bloq)}
                  disabled={line.disabled}
                />
              )}
              {selectedBloq === i && <EmptyBloq />}
              {selectedPlaceholder === i + 1 && <EmptyPlaceholder />}
              {(selectedBloq === i || i === bloqs.length - 1) && (
                <BloqPlaceholder
                  onClick={(e: React.MouseEvent) =>
                    onPlaceholderClick(i + 1, e)
                  }
                  category={BloqCategory.Action}
                  half={i < bloqs.length - 1}
                />
              )}
            </React.Fragment>
          ))}
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
        {showOptions && (
          <Options ref={optionsRef}>
            {!isFirst && (
              <OptionsButton secondary onClick={() => onMoveUp(line)}>
                <UpIcon name="arrow-left" />
              </OptionsButton>
            )}
            {!isLast && (
              <OptionsButton secondary onClick={() => onMoveDown(line)}>
                <DownIcon name="arrow-left" />
              </OptionsButton>
            )}
            <OptionsButton secondary onClick={() => onDuplicate(line)}>
              <Icon name="programming-duplicate" />
            </OptionsButton>
            <OptionsButton secondary onClick={() => onToggle(line)}>
              <Icon name={line.disabled ? "eye" : "eye-close"} />
            </OptionsButton>
            <OptionsButton red onClick={() => onDelete(line)}>
              <Icon name="trash" />
            </OptionsButton>
          </Options>
        )}
      </Container>
      {bloqs.length > 0 && (
        <ShowOptionsButton
          ref={showOptionsRef}
          secondary
          onClick={() => setShowOptions(!showOptions)}
          active={showOptions}
        >
          <Icon name="ellipsis" />
        </ShowOptionsButton>
      )}
    </>
  );
};

export default BloqsLine;

/* styled components */

const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Bloqs = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding-right: 80px;
  background-color: #f1f1f1;
  padding: 10px;
  height: 103px;
  box-sizing: border-box;
  overflow-y: auto;
`;

const StyledBloq = styled(HorizontalBloq)`
  margin-right: 2px;
  flex-shrink: 0;
`;

const EmptyBloq = styled.div`
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

const Options = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(55, 59, 68, 0.8);
  z-index: 80;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OptionsButton = styled(JuniorButton)`
  padding: 10px;
  height: 40px;
  width: 40px;
  margin: 0px 5px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const UpIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const DownIcon = styled(Icon)`
  transform: rotate(-90deg);
`;

const ShowOptionsButton = styled(JuniorButton)`
  margin-left: 10px;
  height: 100px;
  padding: 0px 10px;
  svg {
    width: 20px;
  }
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
