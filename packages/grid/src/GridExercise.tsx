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

const getActionIndex = (bloqIndex: number, actions: IActions) => {
  let i = 0;
  let j = 1;

  while (i < actions.length) {
    const action = actions[i];
    if (action.type === ActionType.Loop) {
      if (
        bloqIndex >= j &&
        bloqIndex <= j + (action as ILoop).children.length + 1
      ) {
        return [i, bloqIndex - j];
      } else {
        j += (action as ILoop).children.length + 2;
      }
    } else {
      if (bloqIndex === j) {
        return [i, -1];
      }
      j++;
    }
    i++;
  }

  return [i, -1];
};

const GridExercise: FC<IGridExerciseProps> = ({
  actions,
  className,
  availableBloqs,
  onChange,
  children
}) => {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(-1);
  const [selectedBloq, setSelectedBloq] = useState(-1);
  const [selectedLeft, setSelectedLeft] = useState(0);

  const [selectedActionIndex, loopPlaceholder] = getActionIndex(
    selectedPlaceholder >= 0 ? selectedPlaceholder : selectedBloq,
    actions
  );

  const addBloq = (bloqType: IBloqType) => {
    if (bloqType.name === "loop") {
      const action: ILoop = { type: ActionType.Loop, children: [], repeat: 2 };
      onChange(
        update(actions, {
          $splice: [[selectedPlaceholder - 1, 0, action]]
        })
      );
    } else {
      if (loopPlaceholder >= 0) {
        onChange(
          update(actions, {
            [selectedActionIndex]: {
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
              [selectedActionIndex, 0, { type: bloqType.name as ActionType }]
            ]
          })
        );
      }
    }
    setSelectedPlaceholder(selectedPlaceholder + 1);
  };

  const deleteBloq = (bloq: number) => {
    if (loopPlaceholder >= 0) {
      onChange(
        update(actions, {
          [selectedActionIndex]: {
            children: {
              $splice: [[loopPlaceholder - 1, 1]]
            }
          }
        })
      );
    } else {
      onChange(
        update(actions, {
          $splice: [[selectedActionIndex, 1]]
        })
      );
    }
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
          $splice: [[selectedActionIndex, 1, updatedAction]]
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

  const shrinkLoop = () => {
    const loopAction = actions[selectedActionIndex] as ILoop;
    const lastAction = loopAction.children[loopAction.children.length - 1];
    const updatedLoop = update(loopAction, {
      children: { $splice: [[loopAction.children.length - 1, 1]] }
    });

    onChange(
      update(actions, {
        $splice: [
          [selectedActionIndex, 1, updatedLoop],
          [selectedActionIndex + 1, 0, lastAction]
        ]
      })
    );
    setSelectedBloq(selectedBloq - 1);
  };

  const growLoop = () => {
    const loopAction = actions[selectedActionIndex] as ILoop;
    const nextAction = actions[selectedActionIndex + 1];
    const updatedLoop = update(loopAction, {
      children: { $splice: [[loopAction.children.length, 0, nextAction]] }
    });

    onChange(
      update(actions, {
        $splice: [
          [selectedActionIndex, 1, updatedLoop],
          [selectedActionIndex + 1, 1]
        ]
      })
    );
    setSelectedBloq(selectedBloq + 1);
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
    .filter(type => !(loopPlaceholder >= 0 && type === "loop"))
    .reduce((filtered, type) => {
      const number =
        availableBloqs[type] - actions.filter(a => a.type === type).length;
      return number ? { ...filtered, [type]: number } : filtered;
    }, {});

  return (
    <Container className={className}>
      <ContentWrap>
        <Content>
          {children}
          <BloqsList bloqs={filteredAvailableBloqs} />
        </Content>
        <AddBloqPanel
          isOpen={selectedPlaceholder > 0}
          availableBloqs={filteredAvailableBloqs}
          onSelectBloqType={addBloq}
          onClose={() => setSelectedPlaceholder(-1)}
          selectedLeft={selectedLeft}
        />
      </ContentWrap>
      <StyledBloqsLine
        bloqTypes={bloqTypes}
        line={bloqLine}
        onBloqClick={selectBloq}
        selectedBloq={selectedBloq}
        selectedPlaceholder={selectedPlaceholder}
        onSelectedPositionChange={setSelectedLeft}
        onPlaceholderClick={selectPlaceholder}
        getBloqPort={b => undefined}
        editInPlace={true}
        onDeleteBloq={deleteBloq}
        onUpdateBloq={updateBloq}
        onShrinkLoop={shrinkLoop}
        onGrowLoop={growLoop}
      />
    </Container>
  );
};

export default GridExercise;

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  align-items: self-start;
  display: flex;
  padding-top: 10px;

  > :not(:last-child) {
    padding-right: 10px;
  }
`;

const ContentWrap = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;
`;

const StyledBloqsLine = styled(BloqsLine)`
  flex: unset;
  margin: 0 10px;
  padding: 10px 0;
`;
