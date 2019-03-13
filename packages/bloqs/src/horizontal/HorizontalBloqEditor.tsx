import React, { useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import BloqsLine from "./BloqsLine";
import AddBloqPanel from "./AddBloqPanel";

import { Bloq, BloqType, BloqTypeGroup, BloqCategory } from "../index.d";

interface HorizontalBloqEditorProps {
  bloqs: Bloq[][];
  bloqTypes: BloqType[];
  bloqGroups: BloqTypeGroup[];
  onBloqsChange: (bloqs: Bloq[][]) => any;
}

const HorizontalBloqEditor: React.FunctionComponent<
  HorizontalBloqEditorProps
> = ({ bloqs, bloqTypes, bloqGroups, onBloqsChange }) => {
  const [addingBloqIndex, setAddingBloqIndex] = useState(-1);

  const addingBloq = bloqs[addingBloqIndex] || [];
  const addingBloqCategory = addingBloq.length > 0
      ? BloqCategory.Action
      : BloqCategory.Event;
  const addingBloqGroups =
    addingBloqIndex >= 0 && addingBloqCategory
      ? bloqGroups.filter(group => group.category === addingBloqCategory)
      : [];

  return (
    <Container onClick={() => setAddingBloqIndex(-1)}>
      <Lines>
        {bloqs.map((line, i) => (
          <Line key={i}>
            <Number>{i + 1}</Number>
            <BloqsLine
              bloqs={line}
              bloqTypes={bloqTypes}
              placeholderSelected={addingBloqIndex === i}
              onPlaceholderClick={e => {
                e.stopPropagation();
                setAddingBloqIndex(i);
              }}
            />
          </Line>
        ))}
        <Line>
          <Number>{bloqs.length + 1}</Number>
          <BloqsLine
            bloqs={[]}
            bloqTypes={bloqTypes}
            placeholderSelected={addingBloqIndex === bloqs.length}
            onPlaceholderClick={e => {
              e.stopPropagation();
              setAddingBloqIndex(bloqs.length);
            }}
          />
        </Line>
      </Lines>
      <AddBloqPanel
        onClick={e => e.stopPropagation()}
        isOpen={addingBloqIndex >= 0}
        bloqTypeGroups={addingBloqGroups}
        bloqTypes={bloqTypes}
        onTypeSelected={(type: string) => {
          const newBloq: Bloq = {
            type,
            parameters: []
          };

          if (addingBloqIndex < bloqs.length) {
            onBloqsChange(
              update(bloqs, { [addingBloqIndex]: { $push: [newBloq] } })
            );
          } else {
            onBloqsChange(update(bloqs, { $push: [[newBloq]] }));
          }
          setAddingBloqIndex(-1);
        }}
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
