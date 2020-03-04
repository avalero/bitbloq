import React from "react";
import { IBloqType, BloqsLine, BloqCategory, IBloqLine } from "@bitbloq/bloqs";

export default {
  component: BloqsLine,
  title: "grid/Program"
};

const bloqTypes: IBloqType[] = [
  {
    category: BloqCategory.Event,
    name: "start",
    icon: "airplane",
    actions: [],
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "forward",
    icon: "folder",
    actions: [],
    code: {}
  }
];

const bloqLine: IBloqLine = {
  id: "0",
  bloqs: [
    {
      type: "start",
      parameters: {}
    }
  ]
};

export const Program = () => (
  <BloqsLine
    bloqTypes={bloqTypes}
    line={bloqLine}
    onBloqClick={i => console.log(i)}
    isFirst={true}
    isLast={true}
    selectedBloq={-1}
    selectedPlaceholder={-1}
    onScrollChange={e => console.log(e)}
    onPlaceholderClick={e => console.log(e)}
    onDelete={e => console.log(e)}
    onDuplicate={e => console.log(e)}
    onMoveDown={e => console.log(e)}
    onMoveUp={e => console.log(e)}
    onToggle={e => console.log(e)}
    getBloqPort={b => undefined}
  />
);
