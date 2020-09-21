import React, { FC, useState } from "react";
import { MelodyEditor, IMelodyNote } from "@bitbloq/ui";

export default {
  component: MelodyEditor,
  title: "ui/MelodyEditor"
};

export const Default: FC = () => {
  const [notes, setNodes] = useState<IMelodyNote[]>([
    { duration: 2, note: "C4" },
    { duration: 2, note: "D4" },
    { duration: 2, note: "E4" },
    { duration: 2, note: "F4" }
  ]);

  return (
    <div style={{ height: 440, width: 880 }}>
      <MelodyEditor notes={notes} onChange={setNodes} />
    </div>
  );
};

export const Small: FC = () => {
  const [notes, setNodes] = useState<IMelodyNote[]>([
    { duration: 2, note: "C4" },
    { duration: 2, note: "D4" },
    { duration: 2, note: "E4" },
    { duration: 2, note: "F4" }
  ]);

  return (
    <div style={{ height: 260, width: 420 }}>
      <MelodyEditor notes={notes} onChange={setNodes} />
    </div>
  );
};
