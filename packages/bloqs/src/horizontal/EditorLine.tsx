import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { colors, Icon, JuniorButton } from "@bitbloq/ui";
import BloqsLine from "./BloqsLine";

import { IBloq, IBloqLine, IBloqType } from "../index";
import { BloqCategory } from "../enums";

interface IEditorLineProps {
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
  onSelectedPositionChange: (scrollLeft: number) => void;
  readOnly?: boolean;
  activeBloq?: number;
}

const EditorLine: React.FunctionComponent<IEditorLineProps> = ({
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
  onSelectedPositionChange,
  readOnly,
  activeBloq
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const showOptionsRef = useRef<HTMLButtonElement>(null);

  const { bloqs } = line;

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
    document.addEventListener("mousedown", onDocumentClick);
    return () => {
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

  return (
    <Wrap>
      {!startsWithEvent() && bloqs.length > 0 ? (
        <MissingEventIcon>
          <Icon name="programming-question" />
        </MissingEventIcon>
      ) : line.disabled ? (
        <DisabledIcon>
          <Icon name="eye-close" />
        </DisabledIcon>
      ) : (
        <LineBullet />
      )}

      <Container>
        <BloqsLine
          line={line}
          bloqTypes={bloqTypes}
          selectedBloq={selectedBloq}
          selectedPlaceholder={selectedPlaceholder}
          onBloqClick={onBloqClick}
          onPlaceholderClick={onPlaceholderClick}
          getBloqPort={getBloqPort}
          onSelectedPositionChange={onSelectedPositionChange}
          readOnly={readOnly}
          activeBloq={activeBloq}
          activeIndicator={
            <ActiveIndicator>
              <Icon name="flag" />
            </ActiveIndicator>
          }
        />
        {showOptions && (
          <Options ref={optionsRef}>
            {!isFirst && (
              <OptionsButton
                secondary
                onClick={() => onMoveUp(line)}
                type="button"
              >
                <UpIcon name="arrow-left" />
              </OptionsButton>
            )}
            {!isLast && (
              <OptionsButton
                secondary
                onClick={() => onMoveDown(line)}
                type="button"
              >
                <DownIcon name="arrow-left" />
              </OptionsButton>
            )}
            <OptionsButton
              secondary
              onClick={() => onDuplicate(line)}
              type="button"
            >
              <Icon name="programming-duplicate" />
            </OptionsButton>
            <OptionsButton
              secondary
              onClick={() => onToggle(line)}
              type="button"
            >
              <Icon name={line.disabled ? "eye" : "eye-close"} />
            </OptionsButton>
            <OptionsButton red onClick={() => onDelete(line)} type="button">
              <Icon name="trash" />
            </OptionsButton>
          </Options>
        )}
      </Container>
      {bloqs.length > 0 &&
        !readOnly &&
        selectedPlaceholder < 0 &&
        selectedBloq < 0 && (
          <ShowOptionsButton
            ref={showOptionsRef}
            onClick={() => setShowOptions(!showOptions)}
            active={showOptions}
            tertiary
            type="button"
          >
            <Icon name="ellipsis" />
          </ShowOptionsButton>
        )}
      {(selectedPlaceholder >= 0 || selectedBloq >= 0) && (
        <ShowOptionsPlaceholder />
      )}
    </Wrap>
  );
};

export default EditorLine;

/* styled components */

const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const LineBullet = styled.div`
  min-width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #3b3e45;
  margin-right: 10px;
`;

const DisabledIcon = styled.div`
  min-width: 32px;
  height: 32px;
  margin-right: 10px;
  svg {
    width: 32px;
    height: 32px;
  }
`;

const MissingEventIcon = styled.div`
  min-width: 32px;
  height: 32px;
  margin-right: 10px;
  color: ${colors.red};
  svg {
    width: 32px;
    height: 32px;
  }
`;

const Container = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  overflow: hidden;
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

const ShowOptionsPlaceholder = styled.div`
  margin-left: 10px;
  width: 40px;
`;

const ActiveIndicator = styled.div`
  width: 24px;
  height: 20px;
  border-radius: 2px;
  position: absolute;
  top: -8px;
  right: 12px;
  background-color: ${colors.brandOrange};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 14px;
    height: 14px;
  }
`;
