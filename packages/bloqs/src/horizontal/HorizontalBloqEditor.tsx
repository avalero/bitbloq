import React, { useState } from "react";
import update from "immutability-helper";
import { Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import BloqsLine from "./BloqsLine";
import AddBloqPanel from "./AddBloqPanel";
import BloqPropertiesPanel from "./BloqPropertiesPanel";

import { Bloq, BloqType, BloqTypeGroup, BloqCategory } from "../index.d";

interface HorizontalBloqEditorProps {
  bloqs: Bloq[][];
  bloqTypes: BloqType[];
  eventBloqGroups: BloqTypeGroup[];
  waitBloqGroups: BloqTypeGroup[];
  actionBloqGroups: BloqTypeGroup[];
  onBloqsChange: (bloqs: Bloq[][]) => any;
}

const HorizontalBloqEditor: React.FunctionComponent<
  HorizontalBloqEditorProps
> = ({
  bloqs,
  bloqTypes,
  eventBloqGroups,
  waitBloqGroups,
  actionBloqGroups,
  onBloqsChange
}) => {
  const [selectedBloqIndex, setSelectedBloq] = useState([-1, -1]);

  const selectedLine = bloqs[selectedBloqIndex[0]] || [];
  const selectedBloq = selectedLine[selectedBloqIndex[1]];
  const isEventPlaceholderSelected =
    selectedBloqIndex[1] === 0 && selectedLine.length === 0;
  const isActionPlaceholderSelected =
    selectedBloqIndex[1] === selectedLine.length && selectedLine.length > 0;

  const t = useTranslate();

  const onAddBloq = (type: string) => {
    const newBloq: Bloq = {
      type,
      parameters: []
    };

    if (selectedBloqIndex[0] < bloqs.length) {
      onBloqsChange(
        update(bloqs, { [selectedBloqIndex[0]]: { $push: [newBloq] } })
      );
    } else {
      onBloqsChange(update(bloqs, { $push: [[newBloq]] }));
    }
    setSelectedBloq([-1, -1]);
  };

  return (
    <Container onClick={() => setSelectedBloq([-1, -1])}>
      <Lines>
        {bloqs.map((line, i) => (
          <Line key={i}>
            <Number>{i + 1}</Number>
            <BloqsLine
              bloqs={line}
              bloqTypes={bloqTypes}
              selectedBloq={
                selectedBloqIndex[0] === i ? selectedBloqIndex[1] : -1
              }
              onBloqClick={(j, e) => {
                e.stopPropagation();
                setSelectedBloq([i, j]);
              }}
            />
          </Line>
        ))}
        <Line>
          <Number>{bloqs.length + 1}</Number>
          <BloqsLine
            bloqs={[]}
            bloqTypes={bloqTypes}
            selectedBloq={
              selectedBloqIndex[0] === bloqs.length ? selectedBloqIndex[1] : -1
            }
            onBloqClick={(j, e) => {
              e.stopPropagation();
              setSelectedBloq([bloqs.length, j]);
            }}
          />
        </Line>
      </Lines>
      <AddBloqPanel
        onClick={e => e.stopPropagation()}
        isOpen={isEventPlaceholderSelected}
        bloqTabs={[
          {
            label: t("bloqs-sensors"),
            icon: <Icon name="programming2" />,
            groups: eventBloqGroups
          }
        ]}
        bloqTypes={bloqTypes}
        onTypeSelected={onAddBloq}
      />
      <AddBloqPanel
        onClick={e => e.stopPropagation()}
        isOpen={isActionPlaceholderSelected}
        bloqTabs={[
          {
            label: t("bloqs-actions"),
            icon: <Icon name="programming" />,
            groups: actionBloqGroups
          },
          {
            label: t("bloqs-waits"),
            icon: <Icon name="programming3" />,
            groups: waitBloqGroups
          }
        ]}
        bloqTypes={bloqTypes}
        onTypeSelected={onAddBloq}
      />
      <BloqPropertiesPanel
        isOpen={!!selectedBloq}
        bloq={selectedBloq}
        bloqType={
          selectedBloq &&
          bloqTypes.find(type => type.name === selectedBloq.type)!
        }
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
