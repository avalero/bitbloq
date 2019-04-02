import { BloqCategory } from "./enums";
import EventShape from "./horizontal/EventShape";
import HalfActionShape from "./horizontal/HalfActionShape";
import ActionShape from "./horizontal/ActionShape";
import WaitShape from "./horizontal/WaitShape";

export const bloqColors = {
  [BloqCategory.Event]: "#d8af31",
  [BloqCategory.Action]: "#59b52e",
  [BloqCategory.Wait]: "#d8d8d8"
};

export const horizontalShapes = {
  [BloqCategory.Event]: EventShape,
  [BloqCategory.Action]: ActionShape,
  [BloqCategory.Wait]: WaitShape
};

export const halfHorizontalShapes = {
  [BloqCategory.Action]: HalfActionShape
};
