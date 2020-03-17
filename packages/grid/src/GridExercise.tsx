import React, { FC, useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { IBloq, IBloqType, IBloqLine, BloqsLine } from "@bitbloq/bloqs";
import AddBloqPanel from "./AddBloqPanel";
import BloqsList from "./BloqsList";
import { ActionType, IActions, ILoop } from "./index";
import { bloqTypes } from "./config";

export interface IGridExerciseProps {
  actions: IActions;
  onChange: (actions: IActions) => any;
  availableBloqs: { [bloq: string]: number };
  className?: string;
}

const getLoopAction = (placeholder: number, actions: IActions) => {
  let i = 0;
  let j = 0;

  while (i < actions.length) {
    const action = actions[i];
    j++;
    if (action.type === ActionType.Loop) {
      if (
        placeholder >= j &&
        placeholder < j + (action as ILoop).children.length + 1
      ) {
        return [i, placeholder - j];
      } else {
        j += (action as ILoop).children.length + 1;
      }
    }
    i++;
  }

  return [-1, 0];
};

const GridExercise: FC<IGridExerciseProps> = ({
  actions,
  className,
  availableBloqs,
  onChange,
  children
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);
  const [selectedBloq, setSelectedBloq] = useState(-1);
  const [scrollLeft, setScrollLeft] = useState(0);

  const addBloq = (bloqType: IBloqType) => {
    if (bloqType.name === "loop") {
      const action: ILoop = { type: ActionType.Loop, children: [], repeat: 2 };
      onChange(
        update(actions, {
          $splice: [[selectedPlaceholder - 1, 0, action]]
        })
      );
    } else {
      const [loopIndex, loopPlaceholder] = getLoopAction(
        selectedPlaceholder - 1,
        actions
      );
      if (loopIndex >= 0) {
        onChange(
          update(actions, {
            [loopIndex]: {
              children: {
                $splice: [
                  [loopPlaceholder, 0, { type: bloqType.name as ActionType }]
                ]
              }
            }
          })
        );
      } else {
        onChange(
          update(actions, {
            $splice: [
              [
                selectedPlaceholder - 1,
                0,
                { type: bloqType.name as ActionType }
              ]
            ]
          })
        );
      }
    }
    setSelectedPlaceholder(selectedPlaceholder + 1);
  };

  const deleteBloq = (bloq: number) => {
    onChange(
      update(actions, {
        $splice: [[selectedBloq - 1, 1]]
      })
    );
    setSelectedBloq(-1);
  };

  const updateBloq = (index: number, newBloq: IBloq) => {
    if (newBloq.type === "loop") {
      const updatedAction: ILoop = {
        ...(actions[index - 1] as ILoop),
        repeat: newBloq.parameters.repeat as number
      };
      onChange(
        update(actions, {
          $splice: [[index - 1, 1, updatedAction]]
        })
      );
    }
  };

  const selectBloq = (bloq: number) => {
    setSelectedBloq(bloq);
    setSelectedPlaceholder(-1);
  };

  const selectPlaceholder = (placeholder: number) => {
    setSelectedPlaceholder(placeholder);
    setSelectedBloq(-1);
  };

  const bloqLine: IBloqLine = {
    id: "0",
    bloqs: [
      {
        type: "start"
      },
      ...actions
    ].flatMap(action => {
      if (action.type === ActionType.Loop) {
        const loopBloq: IBloq = {
          type: "loop",
          parameters: { repeat: (action as ILoop).repeat }
        };
        return [
          loopBloq,
          ...(action as ILoop).children.map(child => ({
            type: child.type,
            parameters: {}
          })),
          { type: "end-loop", parameters: {} }
        ];
      } else {
        return [
          {
            type: action.type,
            parameters: {}
          }
        ];
      }
    })
  };

  const filteredAvailableBloqs = Object.keys(availableBloqs)
    .filter(
      type =>
        getLoopAction(selectedPlaceholder - 1, actions)[0] < 0 ||
        type !== "loop"
    )
    .reduce((filtered, type) => {
      const number =
        availableBloqs[type] - actions.filter(a => a.type === type).length;
      return number ? { ...filtered, [type]: number } : filtered;
    }, {});

  return (
    <Container className={className}>
      <Content>
        {children}
        <BloqsList bloqs={filteredAvailableBloqs} />
      </Content>
      <AddBloqPanel
        isOpen={selectedPlaceholder > 0}
        availableBloqs={filteredAvailableBloqs}
        onSelectBloqType={addBloq}
        selectedPlaceholder={selectedPlaceholder}
        onClose={() => setSelectedPlaceholder(-1)}
        linesScrollLeft={scrollLeft}
      />
      <BloqsLineWrap>
        <BloqsLine
          bloqTypes={bloqTypes}
          line={bloqLine}
          onBloqClick={selectBloq}
          selectedBloq={selectedBloq}
          selectedPlaceholder={selectedPlaceholder}
          onScrollChange={setScrollLeft}
          onPlaceholderClick={selectPlaceholder}
          getBloqPort={b => undefined}
          editInPlace={true}
          onDeleteBloq={deleteBloq}
          onUpdateBloq={updateBloq}
        />
      </BloqsLineWrap>
    </Container>
  );
};

export default GridExercise;

const Container = styled.div`
  position: relative;
  flex: 1;
  height: 100%;
`;

const Content = styled.div`
  position: absolute;
  top: 20px;
  bottom: 143px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
`;

const BloqsLineWrap = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
`;
