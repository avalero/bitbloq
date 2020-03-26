export enum ActionType {
  Forward = "forward",
  Back = "back",
  Left = "left",
  Right = "right",
  Push = "push",
  Pick = "pick",
  Use = "use",
  Loop = "loop"
}

export interface IAction {
  type: ActionType;
}

export interface ILoop {
  type: ActionType.Loop;
  repeat: number;
  children: IAction[];
}

export type IActions = Array<IAction | ILoop>;
