import React, { useState } from "react";
import update from "immutability-helper";
import { Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import BloqsLine from "./BloqsLine";
import AddBloqPanel from "./AddBloqPanel";
import BloqPropertiesPanel from "./BloqPropertiesPanel";

import { BloqCategory } from "../enums";
import {
  IBloq,
  IBloqType,
  IBloqTypeGroup,
  IComponentInstance,
  isBloqSelectParameter,
  isBloqSelectComponentParameter
} from "../index";

interface IHorizontalBloqEditorProps {
  bloqs: IBloq[][];
  bloqTypes: IBloqType[];
  onBloqsChange: (bloqs: IBloq[][]) => any;
  getComponents: (types: string[]) => IComponentInstance[];
  getBloqPort: (bloq: IBloq) => string | undefined;
  eventGroups: IBloqTypeGroup[];
  actionGroups: IBloqTypeGroup[];
  waitGroups: IBloqTypeGroup[];
}

const HorizontalBloqEditor: React.FunctionComponent<
  IHorizontalBloqEditorProps
> = ({
  bloqs,
  bloqTypes,
  onBloqsChange,
  getComponents,
  getBloqPort,
  eventGroups,
  actionGroups,
  waitGroups
}) => {
  const [selectedLineIndex, setSelectedLine] = useState(-1);
  const [selectedBloqIndex, setSelectedBloq] = useState(-1);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);

  const selectedLine = bloqs[selectedLineIndex] || [];
  const selectedBloq = selectedLine[selectedBloqIndex];

  const t = useTranslate();

  const deselectEverything = () => {
    setSelectedLine(-1);
    setSelectedBloq(-1);
    setSelectedPlaceholder(-1);
  };

  const onAddBloq = (typeName: string) => {
    const bloqType = bloqTypes.find(type => type.name === typeName)!;
    const newBloq: IBloq = {
      type: typeName,
      parameters: (bloqType.parameters || []).reduce((obj, param) => {
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
          const { name = "" } = compatibleComponents[0] || {};
          obj[param.name] = name;
        }
        return obj;
      }, {})
    };

    if (selectedLineIndex < bloqs.length) {
      onBloqsChange(
        update(bloqs, {
          [selectedLineIndex]: { $splice: [[selectedPlaceholder, 0, newBloq]] }
        })
      );
    } else {
      onBloqsChange(update(bloqs, { $push: [[newBloq]] }));
    }
    setSelectedBloq(selectedPlaceholder);
    setSelectedPlaceholder(-1);
  };

  const onUpdateBloq = (newBloq: IBloq) => {
    onBloqsChange(
      update(bloqs, {
        [selectedLineIndex]: { [selectedBloqIndex]: { $set: newBloq } }
      })
    );
  };

  const onDeleteBloq = () => {
    onBloqsChange(
      update(bloqs, {
        [selectedLineIndex]: { $splice: [[selectedBloqIndex, 1]] }
      })
    );
    deselectEverything();
  };

  return (
    <Container>
      <Lines onClick={deselectEverything}>
        {[...bloqs, []].map((line, i) => (
          <Line key={i}>
            <Number>{i + 1}</Number>
            <BloqsLine
              bloqs={line}
              bloqTypes={bloqTypes}
              getBloqPort={getBloqPort}
              selectedBloq={selectedLineIndex === i ? selectedBloqIndex : -1}
              selectedPlaceholder={
                selectedLineIndex === i ? selectedPlaceholder : -1
              }
              onBloqClick={(j, e) => {
                e.stopPropagation();
                setSelectedLine(i);
                setSelectedBloq(j);
                setSelectedPlaceholder(-1);
              }}
              onPlaceholderClick={(j, e) => {
                e.stopPropagation();
                setSelectedLine(i);
                setSelectedBloq(-1);
                setSelectedPlaceholder(j);
              }}
            />
          </Line>
        ))}
      </Lines>
      <AddBloqPanel
        onClick={e => e.stopPropagation()}
        isOpen={selectedPlaceholder === 0}
        bloqTabs={[
          {
            label: t("bloqs-sensors"),
            icon: <Icon name="programming2" />,
            groups: eventGroups
          }
        ]}
        bloqTypes={bloqTypes}
        onTypeSelected={onAddBloq}
      />
      <AddBloqPanel
        onClick={e => e.stopPropagation()}
        isOpen={selectedPlaceholder > 0}
        bloqTabs={[
          {
            label: t("bloqs-actions"),
            icon: <Icon name="programming" />,
            groups: actionGroups
          },
          {
            label: t("bloqs-waits"),
            icon: <Icon name="programming3" />,
            groups: waitGroups
          }
        ]}
        bloqTypes={bloqTypes}
        onTypeSelected={onAddBloq}
      />
      <BloqPropertiesPanel
        isOpen={!!selectedBloq}
        bloq={selectedBloq}
        getComponents={getComponents}
        bloqType={
          selectedBloq &&
          bloqTypes.find(type => type.name === selectedBloq.type)!
        }
        onUpdateBloq={onUpdateBloq}
        onDeleteBloq={onDeleteBloq}
      />
    </Container>
  );
};

export default HorizontalBloqEditor;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Lines = styled.div`
  flex: 1;
  padding: 40px;
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`;

const Number = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #3b3e45;
  font-weight: bold;
  font-size: 32px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;
