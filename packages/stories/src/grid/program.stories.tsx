import React, { useState } from "react";
import { GridExercise, IActions, ActionType } from "@bitbloq/grid";

export default {
  component: GridExercise,
  title: "grid/Exercise"
};

export const Program = () => {
  const [actions, setActions] = useState<IActions>([]);
  return (
    <div
      style={{
        width: 1200,
        height: 572,
        border: "1px solid #ccc",
        display: "flex",
        position: "relative"
      }}
    >
      <GridExercise
        actions={actions}
        availableBloqs={{
          forward: -1,
          back: 2,
          left: 3,
          right: 1,
          pick: 10,
          use: 20,
          push: 3,
          loop: 2
        }}
        onChange={setActions}
      />
    </div>
  );
};

export const ProgramTablet = () => {
  const [actions, setActions] = useState<IActions>([]);
  return (
    <div
      style={{
        width: 588,
        height: 380,
        border: "1px solid #ccc",
        display: "flex",
        position: "relative"
      }}
    >
      <GridExercise
        actions={actions}
        availableBloqs={{
          forward: 1,
          back: 2,
          left: 3,
          right: 1,
          pick: 1,
          use: 1,
          push: 3,
          loop: 2
        }}
        onChange={setActions}
      />
    </div>
  );
};

export const ReadOnlyProgram = () => {
  return (
    <div
      style={{
        width: 1200,
        height: 572,
        border: "1px solid #ccc",
        display: "flex",
        position: "relative"
      }}
    >
      <GridExercise
        actions={[
          { type: ActionType.Forward },
          { type: ActionType.Forward },
          {
            type: ActionType.Loop,
            children: [{ type: ActionType.Left }, { type: ActionType.Right }]
          },
          { type: ActionType.Forward },
          { type: ActionType.Forward },
          { type: ActionType.Forward },
          { type: ActionType.Forward }
        ]}
        activeAction={6}
      />
    </div>
  );
};
