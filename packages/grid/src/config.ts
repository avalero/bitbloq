import { IBloqType, BloqCategory } from "@bitbloq/bloqs";

import playIcon from "./icons/play.svg";
import forwardIcon from "./icons/forward.svg";
import backIcon from "./icons/back.svg";
import loopIcon from "./icons/loop.svg";
import loopEndIcon from "./icons/loop-end.svg";
import leftIcon from "./icons/left.svg";
import rightIcon from "./icons/right.svg";
import pickIcon from "./icons/pick.svg";
import useIcon from "./icons/use.svg";
import pushIcon from "./icons/push.svg";

export const bloqTypes: IBloqType[] = [
  {
    category: BloqCategory.Event,
    name: "start",
    icon: playIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "forward",
    icon: forwardIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "back",
    icon: backIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "left",
    icon: leftIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "right",
    icon: rightIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "push",
    icon: pushIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "pick",
    icon: pickIcon,
    code: {}
  },
  {
    category: BloqCategory.Action,
    name: "use",
    icon: useIcon,
    code: {}
  },
  {
    category: BloqCategory.Loop,
    name: "loop",
    iconComponent: "LoopIcon",
    code: {}
  },
  {
    category: BloqCategory.EndLoop,
    name: "end-loop",
    icon: loopEndIcon,
    code: {}
  }
];
