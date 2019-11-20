import React from "react";
import { Object3D } from "@bitbloq/lib3d";
import { Icon } from "@bitbloq/ui";
import {
  IShapeGroup,
  IObjectType,
  IOperation,
  ICompositionOperation
} from "./types";

export interface IConfig {
  colors: string[];
  slowTimeoutMS: number;
  addShapeGroups: IShapeGroup[];
  objectTypes: IObjectType[];
  objectOperations: IOperation[];
  defaultOperations: (isAdvancedMode: boolean) => any[];
  compositionOperations: ICompositionOperation[];
}

export interface IRepetitionParams {
  type: string;
}

const config: IConfig = {
  colors: [
    "#ff6900",
    "#fcb900",
    "#7bdcb5",
    "#00d084",
    "#8ed1fc",
    "#0693e3",
    "#abb8c3",
    "#eb144c",
    "#f78da7",
    "#9900ef"
  ],

  slowTimeoutMS: 3000,

  addShapeGroups: [
    {
      label: "basic-shapes",
      icon: <Icon name="basic-shapes" />,
      shapes: [
        {
          type: "Cube",
          label: "object-type-cube",
          icon: <Icon name="cube" />,
          parameters: {
            width: 10,
            depth: 10, // legacy, not used
            height: 10 // legacy, not used
          }
        },
        {
          type: "Sphere",
          label: "object-type-sphere",
          icon: <Icon name="sphere" />,
          parameters: {
            radius: 5
          }
        },
        {
          type: "Cylinder",
          label: "object-type-cylinder",
          icon: <Icon name="cylinder" />,
          parameters: {
            r0: 5,
            r1: 5, // legacy, not used
            height: 10
          }
        },
        {
          type: "RectPrism",
          label: "object-type-rectprism",
          icon: <Icon name="rectangularPrism" />,
          parameters: {
            width: 10,
            height: 10,
            depth: 10
          }
        },
        {
          type: "Prism",
          label: "object-type-prism",
          icon: <Icon name="prism" />,
          parameters: {
            sides: 6,
            length: 5,
            height: 10
          }
        },
        {
          type: "Pyramid",
          label: "object-type-pyramid",
          icon: <Icon name="pyramid" />,
          parameters: {
            sides: 4,
            length: 10,
            height: 15
          }
        },
        {
          type: "Cone",
          label: "object-type-cone",
          icon: <Icon name="cone" />,
          parameters: {
            r0: 5,
            r1: 0, // legacy, not used
            height: 10
          }
        }
      ]
    },
    {
      label: "other-shapes",
      icon: <Icon name="basic-shapes" />,
      shapes: [
        {
          type: "SemiCylinder",
          label: "object-type-semicylinder",
          icon: <Icon name="semiCylinder" />,
          parameters: {
            r0: 5,
            height: 10
          }
        },
        {
          type: "TruncatedCone",
          label: "object-type-truncatedcone",
          icon: <Icon name="truncatedcone" />,
          parameters: {
            r0: 6,
            r1: 3,
            height: 10
          }
        },
        {
          type: "Tube",
          label: "object-type-tube",
          icon: <Icon name="tube" />,
          parameters: {
            r0: 5,
            r1: 3,
            height: 10
          }
        },
        {
          type: "Torus",
          label: "object-type-torus",
          icon: <Icon name="torus" />,
          parameters: {
            r0: 10,
            r1: 3
          }
        },
        {
          type: "Octahedron",
          label: "object-type-octahedron",
          icon: <Icon name="octahedron" />,
          parameters: {
            side: 10
          }
        },

        {
          type: "Star",
          label: "object-type-star",
          icon: <Icon name="star" />,
          parameters: {
            r0: 10,
            r1: 3,
            height: 4,
            peaks: 5
          }
        },
        {
          type: "Heart",
          label: "object-type-heart",
          icon: <Icon name="heart" />,
          parameters: {
            side: 10,
            height: 3
          }
        },

        {
          type: "TextObject",
          label: "object-type-text-object",
          icon: <Icon name="text" />,
          parameters: {
            text: "Hello",
            size: 10,
            thickness: 5,
            font: "roboto_regular"
          }
        }
      ]
    }
  ],

  objectTypes: [
    {
      name: "TruncatedCone",
      label: "object-type-truncatedcone",
      icon: <Icon name="cone" />,
      parameters: [
        {
          name: "r0",
          label: "param-bottom-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "r1",
          label: "param-top-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Cube",
      label: "object-type-cube",
      icon: <Icon name="cube" />,
      parameters: [
        {
          name: "width",
          label: "param-side-length",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Sphere",
      label: "object-type-sphere",
      icon: <Icon name="sphere" />,
      parameters: [
        {
          name: "radius",
          label: "param-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Cylinder",
      label: "object-type-cylinder",
      icon: <Icon name="cylinder" />,
      parameters: [
        {
          name: "r0",
          label: "param-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        }
      ]
    },
    {
      name: "SemiCylinder",
      label: "object-type-semicylinder",
      icon: <Icon name="semicylinder" />,
      parameters: [
        {
          name: "r0",
          label: "param-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        }
      ]
    },
    {
      name: "Torus",
      label: "object-type-torus",
      icon: <Icon name="torus" />,
      parameters: [
        {
          name: "r0",
          label: "param-torus-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        },
        {
          name: "r1",
          label: "param-ring-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        }
      ]
    },
    {
      name: "Tube",
      label: "object-type-tube",
      icon: <Icon name="cylinder" />,
      parameters: [
        {
          name: "r0",
          label: "param-outer-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        },
        {
          name: "r1",
          label: "param-inner-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        }
      ]
    },
    {
      name: "Star",
      label: "object-type-star",
      icon: <Icon name="star" />,
      parameters: [
        {
          name: "peaks",
          label: "param-peaks",
          type: "integer",
          unit: "unit.peaks",
          minValue: 3
        },
        {
          name: "r0",
          label: "param-outer-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "r1",
          label: "param-inner-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Octahedron",
      label: "object-type-octahedron",
      icon: <Icon name="octahedron" />,
      parameters: [
        {
          name: "side",
          label: "param-side-length",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Cone",
      label: "object-type-cone",
      icon: <Icon name="cone" />,
      parameters: [
        {
          name: "r0",
          label: "param-radius",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Heart",
      label: "object-type-heart",
      icon: <Icon name="heart" />,
      parameters: [
        {
          name: "side",
          label: "param-depth",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "Prism",
      label: "object-type-prism",
      icon: <Icon name="prism" />,
      parameters: [
        {
          name: "sides",
          label: "param-number-of-sides",
          type: "integer",
          unit: "units.sides",
          minValue: 3
        },
        {
          name: "length",
          label: "param-side-length",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0
        }
      ]
    },
    {
      name: "Pyramid",
      label: "object-type-pyramid",
      icon: <Icon name="pyramid" />,
      parameters: [
        {
          name: "sides",
          label: "param-number-of-sides",
          type: "integer",
          unit: "units.sides",
          minValue: 4
        },
        {
          name: "length",
          label: "param-side-length",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "RectPrism",
      label: "object-type-rectprism",
      icon: <Icon name="cube" />,
      parameters: [
        {
          name: "width",
          label: "param-width",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "depth",
          label: "param-depth",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "height",
          label: "param-height",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        }
      ]
    },
    {
      name: "STLObject",
      label: "object-type-stl-object",
      icon: <Icon name="stl" />,
      parameters: []
    },
    {
      name: "PredesignedObject",
      label: "object-type-predesigned-object",
      icon: <Icon name="stl" />,
      parameters: []
    },
    {
      name: "TextObject",
      label: "object-type-text-object",
      icon: <Icon name="text" />,
      parameters: [
        {
          name: "text",
          label: "param-text",
          type: "string"
        },
        {
          name: "size",
          label: "param-size",
          type: "integer",
          unit: "",
          minValue: 0.01
        },
        {
          name: "thickness",
          label: "param-thickness",
          type: "integer",
          unit: "units.mm",
          minValue: 0.01
        },
        {
          name: "font",
          label: "param-font",
          type: "select",
          options: [
            {
              labelId: "roboto_regular",
              value: "roboto_regular"
            },
            {
              labelId: "audiowide_regular",
              value: "audiowide_regular"
            },
            {
              labelId: "fredoka_one_regular",
              value: "fredoka_one_regular"
            },
            {
              labelId: "merriweather_regular",
              value: "merriweather_regular"
            },
            {
              labelId: "pressstart2p_regular",
              value: "pressstart2p_regular"
            }
          ]
        }
      ]
    },
    {
      name: "Union",
      label: "object-type-union",
      icon: <Icon name="union" />,
      canUndo: true,
      undoLabel: "menu-undo-union",
      parameters: []
    },
    {
      name: "Difference",
      label: "object-type-difference",
      icon: <Icon name="difference" />,
      canUndo: true,
      undoLabel: "menu-undo-difference",
      showBaseObject: true,
      parameters: []
    },
    {
      name: "Intersection",
      label: "object-type-intersection",
      icon: <Icon name="intersection" />,
      canUndo: true,
      undoLabel: "menu-undo-intersection",
      parameters: []
    },
    {
      name: "ObjectsGroup",
      label: "object-type-group",
      icon: <Icon name="group" />,
      canUngroup: true,
      withoutColor: true,
      parameters: []
    },
    {
      name: "RepetitionObject",
      label: "object-type-repetition",
      icon: <Icon name="repeat" />,
      withoutColor: true,
      canConverToGroup: true,
      canUndo: true,
      undoLabel: "menu-undo-repetition",
      getParameters: ({ parameters }) => {
        if ((parameters as IRepetitionParams).type === "cartesian") {
          return [
            {
              name: "num",
              label: "param-repetitions",
              type: "integer",
              minValue: 2
            },
            {
              name: "x",
              label: "param-x-repetition",
              type: "integer",
              unit: "units.mm"
            },
            {
              name: "y",
              label: "param-y-repetition",
              type: "integer",
              unit: "units.mm"
            },
            {
              name: "z",
              label: "param-z-repetition",
              type: "integer",
              unit: "units.mm"
            }
          ];
        } else {
          return [
            {
              name: "num",
              label: "param-repetitions",
              type: "integer",
              minValue: 2
            },
            {
              name: "axis",
              label: "param-axis",
              type: "select",
              options: [
                {
                  labelId: "param-x",
                  value: "x"
                },
                {
                  labelId: "param-y",
                  value: "y"
                },
                {
                  labelId: "param-z",
                  value: "z"
                }
              ]
            },
            {
              name: "angle",
              label: "param-angle",
              type: "integer",
              unit: "°"
            }
          ];
        }
      }
    }
  ],

  objectOperations: [
    {
      name: "translation",
      label: "operation-translation",
      basicLabel: "operation-position",
      icon: <Icon name="translation" />,
      color: "#dd5b0c",
      create: () => Object3D.createTranslateOperation(0, 0, 0, false),
      parameters: [
        {
          name: "relative",
          label: "param-translation-relative",
          type: "select",
          advancedMode: true,
          options: [
            {
              labelId: "param-relative-axis",
              value: true
            },
            {
              labelId: "param-absolute-axis",
              value: false
            }
          ]
        },
        {
          name: "x",
          label: "param-x",
          type: "integer",
          unit: "units.mm",
          activeOperation: (object, operation) => ({
            object,
            type: "translation",
            axis: "x",
            relative: operation.relative,
            id: operation.id
          })
        },
        {
          name: "y",
          label: "param-y",
          type: "integer",
          unit: "units.mm",
          activeOperation: (object, operation) => ({
            object,
            type: "translation",
            axis: "y",
            relative: operation.relative,
            id: operation.id
          })
        },
        {
          name: "z",
          label: "param-z",
          type: "integer",
          unit: "units.mm",
          activeOperation: (object, operation) => ({
            object,
            type: "translation",
            axis: "z",
            relative: operation.relative,
            id: operation.id
          })
        }
      ]
    },
    {
      name: "rotation",
      label: "operation-rotation",
      icon: <Icon name="rotation" />,
      color: "#d8af31",
      create: () => Object3D.createRotateOperation(0, 0, 0, false),
      parameters: [
        {
          name: "x",
          label: "param-x",
          type: "integer",
          unit: "°",
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: "rotation",
            axis: "x",
            relative: operation.relative,
            id: operation.id
          })
        },
        {
          name: "y",
          label: "param-y",
          type: "integer",
          unit: "°",
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: "rotation",
            axis: "y",
            relative: operation.relative,
            id: operation.id
          })
        },
        {
          name: "z",
          label: "param-z",
          type: "integer",
          unit: "°",
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: "rotation",
            axis: "z",
            relative: operation.relative,
            id: operation.id
          })
        },
        {
          name: "relative",
          label: "param-rotation-relative",
          type: "select",
          advancedMode: true,
          activeOperation: (object, { x, y, z, relative, id, axis = "x" }) => ({
            object,
            type: "rotation",
            axis,
            relative,
            id
          }),
          options: [
            {
              labelId: "param-relative-axis",
              value: true
            },
            {
              labelId: "param-absolute-axis",
              value: false
            }
          ]
        },
        {
          name: "axis",
          label: "param-axis",
          type: "select",
          advancedMode: true,
          activeOperation: (object, { x, y, z, relative, id, axis = "x" }) => ({
            object,
            type: "rotation",
            axis,
            relative,
            id
          }),
          options: [
            {
              labelId: "param-x",
              value: "x"
            },
            {
              labelId: "param-y",
              value: "y"
            },
            {
              labelId: "param-z",
              value: "z"
            }
          ],
          getValue: operation => {
            if (operation.x !== 0) {
              return "x";
            }
            if (operation.y !== 0) {
              return "y";
            }
            if (operation.z !== 0) {
              return "z";
            }
            return "";
          },
          setValue: (operation, value) => {
            const { x, y, z } = operation;
            const angle = x || y || z;
            return {
              ...operation,
              x: value === "x" ? angle : 0,
              y: value === "y" ? angle : 0,
              z: value === "z" ? angle : 0,
              axis: value
            };
          }
        },
        {
          name: "angle",
          label: "param-angle",
          type: "integer",
          unit: "°",
          advancedMode: true,
          activeOperation: (object, { x, y, z, relative, id, axis = "x" }) => ({
            object,
            type: "rotation",
            axis: (x && "x") || (y && "y") || (z && "z") || axis,
            relative,
            id
          }),
          getValue: operation => {
            const { x, y, z } = operation;
            return x || y || z;
          },
          setValue: (operation, value) => {
            const { x, y, z, axis = "x" } = operation;
            if (x || y || z) {
              return {
                ...operation,
                x: x ? value : 0,
                y: y ? value : 0,
                z: z ? value : 0
              };
            } else {
              return {
                ...operation,
                [axis]: value
              };
            }
          }
        }
      ]
    },
    {
      name: "scale",
      label: "operation-scale",
      icon: <Icon name="scale" />,
      color: "#59b52e",
      create: () => Object3D.createScaleOperation(1, 1, 1),
      parameters: [
        {
          type: "proportional-group",
          parameters: [
            {
              name: "x",
              label: "param-x",
              fineStep: 0.1,
              minValue: 0.01
            },
            {
              name: "y",
              label: "param-y",
              fineStep: 0.1,
              minValue: 0.01
            },
            {
              name: "z",
              label: "param-z",
              fineStep: 0.1,
              minValue: 0.01
            }
          ]
        }
      ]
    },
    {
      name: "mirror",
      label: "operation-reflection",
      icon: <Icon name="reflection" />,
      color: "#00c1c7",
      create: () => Object3D.createMirrorOperation(),
      parameters: [
        {
          name: "plane",
          label: "param-plane",
          type: "select",
          options: [
            {
              labelId: "param-x-y",
              value: "xy"
            },
            {
              labelId: "param-y-z",
              value: "yz"
            },
            {
              labelId: "param-z-x",
              value: "zx"
            }
          ]
        }
      ]
    }
  ],

  defaultOperations: isAdvancedMode => {
    if (isAdvancedMode) {
      return [];
    } else {
      return [
        Object3D.createTranslateOperation(0, 0, 0, false),
        Object3D.createRotateOperation(0, 0, 0, true),
        Object3D.createScaleOperation(1, 1, 1)
      ];
    }
  },

  compositionOperations: [
    {
      name: "Union",
      label: "operation-union",
      icon: <Icon name="union" />,
      minObjects: 2,
      create: children => ({
        type: "Union",
        children,
        operations: []
      })
    },
    {
      name: "Difference",
      label: "operation-difference",
      icon: <Icon name="difference" />,
      minObjects: 2,
      create: children => ({
        type: "Difference",
        children,
        operations: []
      })
    },
    {
      name: "Intersection",
      label: "operation-intersection",
      icon: <Icon name="intersection" />,
      minObjects: 2,
      create: children => ({
        type: "Intersection",
        children,
        operations: []
      })
    },
    {
      name: "ObjectsGroup",
      label: "operation-group",
      icon: <Icon name="group" />,
      minObjects: 2,
      advancedMode: true,
      create: children => ({
        type: "ObjectsGroup",
        children,
        operations: []
      })
    },
    {
      name: "CartesianRepetition",
      label: "operation-repeat",
      icon: <Icon name="repeat" />,
      minObjects: 1,
      maxObjects: 1,
      advancedMode: true,
      create: children => ({
        type: "RepetitionObject",
        children,
        parameters: {
          type: "cartesian",
          num: 2,
          x: 20,
          y: 0,
          z: 0
        },
        operations: []
      })
    },
    {
      name: "PolarRepetition",
      label: "operation-repeat-polar",
      icon: <Icon name="repeat-polar" />,
      minObjects: 1,
      maxObjects: 1,
      advancedMode: true,
      create: children => ({
        type: "RepetitionObject",
        children,
        parameters: {
          type: "polar",
          num: 4,
          axis: "x",
          angle: 180
        },
        operations: []
      })
    }
  ]
};

export default config;
