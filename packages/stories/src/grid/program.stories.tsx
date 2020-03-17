import React, { useState } from "react";
import { GridExercise, IActions } from "@bitbloq/grid";

export default {
  component: GridExercise,
  title: "grid/Exercise"
};

export const Program = () => {
  const [actions, setActions] = useState<IActions>([]);
  return (
    <div
      style={{
        width: 840,
        height: 530,
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
