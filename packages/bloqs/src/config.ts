import { BloqCategory } from "./index.d";
import EventShape from "./horizontal/EventShape";
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
