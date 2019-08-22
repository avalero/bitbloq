import { colors, Icon } from "@bitbloq/ui";

import ThreeDEditor from "./components/ThreeDEditor";
import JuniorEditor from "./components/JuniorEditor";

import {addShapeGroups} from "./configurations/3d/addShapeGroups";
import {bloqTypes} from "./configurations/bloqs/bloqTypes";
import {boards} from "./configurations/hardware/boards";
import {components} from "./configurations/hardware/components";

export {addShapeGroups, bloqTypes, boards, components};

export const documentTypes = {
  bloqs: {
    label: "Robótica por bloques",
    shortLabel: "Robótica",
    color: colors.green,
    supported: false
  },
  "3d": {
    label: "Diseño 3D",
    shortLabel: "Diseño 3D",
    color: colors.brandBlue,
    supported: true,
    editorComponent: ThreeDEditor
  },
  code: {
    label: "Robótica por código",
    shortLabel: "Código",
    color: colors.brandPink,
    supported: false
  },
  junior: {
    label: "Robótica Junior",
    shortLabel: "Junior",
    color: colors.brandOrange,
    supported: true,
    editorComponent: JuniorEditor
  },
  apps: {
    label: "Diseño y programación de Apps",
    shortLabel: "Apps móviles",
    color: colors.brandYellow,
    supported: false
  }
};

