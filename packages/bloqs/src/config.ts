import { BloqCategory } from "./index.d";
import EventShape from "./horizontal/EventShape";
import ActionShape from "./horizontal/ActionShape";

export const bloqColors = {
  [BloqCategory.Event]: "#d8af31",
  [BloqCategory.Timer]: "#d8d8d8",
  [BloqCategory.Action]: "#59b52e"
};

export const horizontalShapes = {
  [BloqCategory.Event]: EventShape,
  [BloqCategory.Action]: ActionShape
};
