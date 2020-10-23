import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import update from "immutability-helper";
import { Icon, JuniorButton } from "@bitbloq/ui";
import styled from "@emotion/styled";
import EditorLine from "./EditorLine";
import BloqConfigPanel from "./BloqConfigPanel";

import {
  IBloq,
  IBloqLine,
  IBloqType,
  IBoard,
  IComponent,
  IComponentInstance,
  IExtraData,
  BloqParameterType,
  isBloqSelectParameter,
  isBloqSelectComponentParameter
} from "../index";

interface IHorizontalBloqEditorProps {
  lines: IBloqLine[];
  bloqTypes: IBloqType[];
  availableBloqs?: IBloqType[];
  onLinesChange?: (lines: IBloqLine[]) => any;
  onUpload?: () => any;
  isDebugging?: boolean;
  onStartDebugging?: () => any;
  onStopDebugging?: () => any;
  getComponents?: (types: string[]) => IComponentInstance[];
  getBloqPort?: (bloq: IBloq) => string | undefined;
  board: IBoard;
  components: IComponent[];
  externalUpload?: boolean;
  readOnly?: boolean;
  extraData?: IExtraData;
  onExtraDataChange?: (extraData: IExtraData) => void;
  activeBloqs?: Record<string, number>;
}

const HorizontalBloqEditor: React.FunctionComponent<IHorizontalBloqEditorProps> = ({
  lines,
  bloqTypes,
  availableBloqs = [],
  onLinesChange = () => null,
  onUpload = () => null,
  isDebugging,
  onStartDebugging,
  onStopDebugging,
  getComponents = () => [],
  getBloqPort = () => "",
  board,
  components,
  externalUpload,
  readOnly,
  extraData,
  onExtraDataChange,
  activeBloqs = {}
}) => {
  const [selectedLineIndex, setSelectedLine] = useState(-1);
  const [selectedBloqIndex, setSelectedBloq] = useState(-1);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);

  const [selectedLeft, setSelectedLeft] = useState(10);

  const [undoPast, setUndoPast] = useState<IBloqLine[][]>([]);
  const [undoFuture, setUndoFuture] = useState<IBloqLine[][]>([]);

  const selectedLine: IBloqLine = lines[selectedLineIndex];
  const selectedBloq = selectedLine && selectedLine.bloqs[selectedBloqIndex];

  const deselectEverything = () => {
    setSelectedLine(-1);
    setSelectedBloq(-1);
    setSelectedPlaceholder(-1);
  };

  const onAddBloq = (bloqType: IBloqType) => {
    const newBloq: IBloq = {
      type: bloqType.name,
      parameters: (bloqType.parameters || []).reduce((obj, param) => {
        if (param.defaultValue) {
          obj[param.name] = param.defaultValue;
        } else {
          if (
            isBloqSelectParameter(param) &&
            param.options &&
            param.options.length > 0
          ) {
            obj[param.name] = param.options[0].value;
          }
          if (isBloqSelectComponentParameter(param)) {
            const compatibleComponents =
              getComponents(bloqType.components || []) || [];
            const { name = "" } =
              compatibleComponents.sort((a, b) => {
                const aPort = Object.values(a.ports || {})[0] || "";
                const bPort = Object.values(b.ports || {})[0] || "";
                const aIsNumber = !isNaN(parseInt(aPort, 10));
                const bIsNumber = !isNaN(parseInt(bPort, 10));

                if ((aIsNumber && bIsNumber) || (!aIsNumber && !bIsNumber)) {
                  return aPort < bPort ? -1 : 1;
                }
                if (aIsNumber) {
                  return -1;
                }
                return 1;
              })[0] || {};

            obj[param.name] = name;
          }
          if (param.type === BloqParameterType.Number) {
            obj[param.name] = 0;
          }
          if (param.type === BloqParameterType.Text) {
            obj[param.name] = "";
          }
          if (param.type === BloqParameterType.Boolean) {
            obj[param.name] = false;
          }
          if (param.type === BloqParameterType.Hidden) {
            obj[param.name] = param.value;
          }
        }
        return obj;
      }, {})
    };

    if (selectedLineIndex < lines.length) {
      onLinesChange(
        update(lines, {
          [selectedLineIndex]: {
            bloqs: { $splice: [[selectedPlaceholder, 0, newBloq]] },
            disabled: {
              $set: lines[selectedLineIndex].disabled && selectedPlaceholder > 0
            }
          }
        })
      );
    } else {
      onLinesChange(
        update(lines, { $push: [{ id: uuid(), bloqs: [newBloq] }] })
      );
    }
    setUndoPast([...undoPast, lines]);
    setUndoFuture([]);
    setSelectedBloq(selectedPlaceholder);
    setSelectedPlaceholder(-1);
  };

  const onUpdateBloq = (newBloq: IBloq) => {
    onLinesChange(
      update(lines, {
        [selectedLineIndex]: {
          bloqs: { [selectedBloqIndex]: { $set: newBloq } }
        }
      })
    );
  };

  const onDeleteBloq = () => {
    const line = lines[selectedLineIndex];
    if (line.bloqs.length === 1) {
      onLinesChange(update(lines, { $splice: [[selectedLineIndex, 1]] }));
    } else {
      onLinesChange(
        update(lines, {
          [selectedLineIndex]: {
            bloqs: { $splice: [[selectedBloqIndex, 1]] },
            disabled: { $set: selectedBloqIndex === 0 }
          }
        })
      );
    }
    setUndoPast([...undoPast, lines]);
    setUndoFuture([]);
    deselectEverything();
  };

  const onUndo = () => {
    onLinesChange(undoPast[undoPast.length - 1]);
    setUndoPast(undoPast.slice(0, undoPast.length - 1));
    setUndoFuture([lines, ...undoFuture]);
  };

  const onRedo = () => {
    onLinesChange(undoFuture[0]);
    setUndoPast([...undoPast, lines]);
    setUndoFuture(undoFuture.slice(1));
  };

  const onMoveLineUp = (line: IBloqLine) => {
    const index = lines.indexOf(line);
    onLinesChange(
      update(lines, {
        $splice: [
          [index, 1],
          [index - 1, 0, line]
        ]
      })
    );
  };

  const onMoveLineDown = (line: IBloqLine) => {
    const index = lines.indexOf(line);
    onLinesChange(
      update(lines, {
        $splice: [
          [index, 1],
          [index + 1, 0, line]
        ]
      })
    );
  };

  const onDuplicateLine = (line: IBloqLine) => {
    const index = lines.indexOf(line);
    onLinesChange(
      update(lines, { $splice: [[index + 1, 0, { ...line, id: uuid() }]] })
    );
  };

  const onToggleLine = (line: IBloqLine) => {
    const index = lines.indexOf(line);
    onLinesChange(
      update(lines, {
        [index]: { disabled: { $set: !line.disabled } }
      })
    );
  };

  const onDeleteLine = (line: IBloqLine) => {
    const index = lines.indexOf(line);
    onLinesChange(update(lines, { $splice: [[index, 1]] }));
  };

  return (
    <Container>
      <Lines onClick={deselectEverything}>
        <LinesWrap selectedLine={selectedLineIndex}>
          {[...lines, ...(readOnly ? [] : [{ id: uuid(), bloqs: [] }])].map(
            (line, i) => (
              <EditorLine
                key={line.id}
                line={line}
                bloqTypes={bloqTypes}
                getBloqPort={getBloqPort}
                selectedBloq={selectedLineIndex === i ? selectedBloqIndex : -1}
                isFirst={i === 0}
                isLast={i === lines.length - 1}
                selectedPlaceholder={
                  selectedLineIndex === i ? selectedPlaceholder : -1
                }
                onBloqClick={(j, e) => {
                  e.stopPropagation();
                  if (!readOnly) {
                    setSelectedLine(i);
                    setSelectedBloq(j);
                    setSelectedPlaceholder(-1);
                  }
                }}
                onPlaceholderClick={(j, e) => {
                  e.stopPropagation();
                  setSelectedLine(i);
                  setSelectedBloq(-1);
                  setSelectedPlaceholder(j);
                }}
                onMoveUp={onMoveLineUp}
                onMoveDown={onMoveLineDown}
                onDuplicate={onDuplicateLine}
                onToggle={onToggleLine}
                onDelete={onDeleteLine}
                onSelectedPositionChange={setSelectedLeft}
                readOnly={readOnly}
                activeBloq={activeBloqs[line.id]}
              />
            )
          )}
        </LinesWrap>
      </Lines>
      {!externalUpload && (
        <Toolbar>
          <ToolbarLeft>
            <JuniorButton
              tertiary
              disabled={undoPast.length === 0}
              onClick={onUndo}
            >
              <Icon name="undo" />
            </JuniorButton>
            <JuniorButton
              tertiary
              disabled={undoFuture.length === 0}
              onClick={onRedo}
            >
              <Icon name="redo" />
            </JuniorButton>
          </ToolbarLeft>
          {onStartDebugging && (
            <UploadButton
              onClick={isDebugging ? onStopDebugging : onStartDebugging}
              orange={!isDebugging}
              tertiary={isDebugging}
            >
              <Icon name="programming-preview" />
            </UploadButton>
          )}
          <UploadButton onClick={onUpload}>
            <Icon name="programming-upload" />
          </UploadButton>
        </Toolbar>
      )}
      <BloqConfigPanel
        isOpen={selectedPlaceholder >= 0 || selectedBloqIndex >= 0}
        bloqTypes={bloqTypes}
        availableBloqs={availableBloqs}
        onSelectBloqType={onAddBloq}
        selectedPlaceholder={selectedPlaceholder}
        selectedBloq={selectedBloq}
        getBloqPort={getBloqPort}
        onUpdateBloq={onUpdateBloq}
        onDeleteBloq={onDeleteBloq}
        onClose={() => deselectEverything()}
        getComponents={getComponents}
        board={board}
        components={components}
        selectedLeft={selectedLeft}
        extraData={extraData}
        onExtraDataChange={onExtraDataChange}
      />
    </Container>
  );
};

export default HorizontalBloqEditor;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
`;

const Lines = styled.div`
  overflow-x: auto;
  flex: 1;
  position: relative;
`;

const LinesWrap = styled.div<{ selectedLine: number }>`
  position: absolute;
  padding: 10px;
  overflow-y: ${props => (props.selectedLine >= 0 ? "hidden" : "auto")};
  width: 100%;
  box-sizing: border-box;
  transform: translate(
    0,
    ${props => (props.selectedLine > 0 ? props.selectedLine * -123 : 0)}px
  );
`;

const Toolbar = styled.div`
  height: 72px;
  border-top: 1px solid #cfcfcf;
  padding: 10px;
  display: flex;
  box-sizing: border-box;
`;

const ToolbarLeft = styled.div`
  flex: 1;
  display: flex;
  margin: 0px -5px;

  button {
    margin: 0px 5px;
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const UploadButton = styled(JuniorButton)`
  padding: 0px 24px;
  margin-left: 10px;
  svg {
    width: 32px;
    height: 32px;
  }
`;
