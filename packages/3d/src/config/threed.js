import React from 'react';
import uuid from 'uuid/v1';
import { Object3D } from '@bitbloq/lib3d';

import { Icon } from '@bitbloq/ui';

const config = {
  colors: [
    '#ff6900',
    '#fcb900',
    '#7bdcb5',
    '#00d084',
    '#8ed1fc',
    '#0693e3',
    '#abb8c3',
    '#eb144c',
    '#f78da7',
    '#9900ef',
  ],

  addShapeGroups: [
    {
      label: 'basic-shapes',
      icon: <Icon name="basic-shapes" />,
      shapes: [
        {
          type: 'Cube',
          label: 'object-type-cube',
          icon: <Icon name="cube" />,
          parameters: {
            width: 10,
            depth: 10, // legacy, not used
            height: 10, // legacy, not used
          },
        },
        {
          type: 'Sphere',
          label: 'object-type-sphere',
          icon: <Icon name="sphere" />,
          parameters: {
            radius: 5,
          },
        },
        {
          type: 'Cylinder',
          label: 'object-type-cylinder',
          icon: <Icon name="cylinder" />,
          parameters: {
            r0: 5,
            r1: 5, // legacy, not used
            height: 10,
          },
        },
        {
          type: 'SemiCylinder',
          label: 'object-type-semicylinder',
          icon: <Icon name="semiCylinder" />,
          parameters: {
            r0: 5,
            height: 10,
          },
        },
        {
          type: 'Cone',
          label: 'object-type-cone',
          icon: <Icon name="cone" />,
          parameters: {
            r0: 5,
            r1: 0, // legacy, not used
            height: 10,
          },
        },
        {
          type: 'TruncatedCone',
          label: 'object-type-truncatedcone',
          icon: <Icon name="truncatedCode" />,
          parameters: {
            r0: 6,
            r1: 3,
            height: 10,
          },
        },
        {
          type: 'Torus',
          label: 'object-type-torus',
          icon: <Icon name="torus" />,
          parameters: {
            r0: 10,
            r1: 3,
          },
        },
        {
          type: 'Tube',
          label: 'object-type-tube',
          icon: <Icon name="torus" />,
          parameters: {
            r0: 5,
            r1: 3,
            height: 10,
          },
        },
        {
          type: 'Star',
          label: 'object-type-star',
          icon: <Icon name="star" />,
          parameters: {
            r0: 10,
            r1: 3,
            height: 4,
            peaks: 5,
          },
        },
        {
          type: 'Prism',
          label: 'object-type-prism',
          icon: <Icon name="prism" />,
          parameters: {
            sides: 6,
            length: 5,
            height: 10,
          },
        },
        {
          type: 'Pyramid',
          label: 'object-type-pyramid',
          icon: <Icon name="pyramid" />,
          parameters: {
            sides: 4,
            length: 10,
            height: 15,
          },
        },
        {
          type: 'RectPrism',
          label: 'object-type-rectprism',
          icon: <Icon name="rectangularPrism" />,
          parameters: {
            width: 10,
            height: 10,
            depth: 10,
          },
        },
        {
          type: 'STLObject',
          label: 'object-type-stl-object',
          icon: <Icon name="stl" />,
          parameters: {
            blob: null,
          },
        },
        {
          type: 'TextObject',
          label: 'object-type-text-object',
          icon: <Icon name="text" />,
          parameters: {
            text: 'Hello',
            size: 10,
            thickness: 5,
            font: 'roboto_regular',
          },
        },
      ],
    },
  ],

  objectTypes: [
    {
      name: 'Cube',
      label: 'object-type-cube',
      icon: <Icon name="cube" />,
      parameters: () => [
        {
          name: 'width',
          label: 'param-side-length',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
      ],
    },
    {
      name: 'Sphere',
      label: 'object-type-sphere',
      icon: <Icon name="sphere" />,
      parameters: () => [
        {
          name: 'radius',
          label: 'param-radius',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
      ],
    },
    {
      name: 'Cylinder',
      label: 'object-type-cylinder',
      icon: <Icon name="cylinder" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-radius',
          type: 'integer',
          unit: 'mm',
        },
        // {
        //   name: 'r1',
        //   label: 'param-top-radius',
        //   type: 'integer',
        //   unit: 'mm',
        // },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'SemiCylinder',
      label: 'object-type-semicylinder',
      icon: <Icon name="semicylinder" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Torus',
      label: 'object-type-torus',
      icon: <Icon name="torus" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-torus-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r1',
          label: 'param-ring-radius',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Tube',
      label: 'object-type-tube',
      icon: <Icon name="cylinder" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-outer-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r1',
          label: 'param-inner-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Star',
      label: 'object-type-star',
      icon: <Icon name="star" />,
      parameters: () => [
        {
          name: 'peaks',
          label: 'param-peaks',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r0',
          label: 'param-outer-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r1',
          label: 'param-inner-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Cone',
      label: 'object-type-cone',
      icon: <Icon name="cylinder" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'TruncatedCone',
      label: 'object-type-truncatedcone',
      icon: <Icon name="truncatedCone" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'param-bottom-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r1',
          label: 'param-top-radius',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Prism',
      label: 'object-type-prism',
      icon: <Icon name="prism" />,
      parameters: () => [
        {
          name: 'sides',
          label: 'param-number-of-sides',
          type: 'integer',
        },
        {
          name: 'length',
          label: 'param-side-length',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'Pyramid',
      label: 'object-type-pyramid',
      icon: <Icon name="pyramid" />,
      parameters: () => [
        {
          name: 'sides',
          label: 'param-number-of-sides',
          type: 'integer',
        },
        {
          name: 'length',
          label: 'param-side-length',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
        },
      ],
    },
    {
      name: 'RectPrism',
      label: 'object-type-rectprism',
      icon: <Icon name="cube" />,
      parameters: () => [
        {
          name: 'width',
          label: 'param-width',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
        {
          name: 'depth',
          label: 'param-depth',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
        {
          name: 'height',
          label: 'param-height',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
      ],
    },
    {
      name: 'STLObject',
      label: 'object-type-stl-object',
      icon: <Icon name="stl" />,
      parameters: () => [
        {
          name: 'blob',
          label: 'param-file',
          type: 'file',
        },
      ],
    },
    {
      name: 'PredesignedObject',
      label: 'object-type-predesigned-object',
      icon: <Icon name="stl" />,
      parameters: () => [],
    },
    {
      name: 'TextObject',
      label: 'object-type-text-object',
      icon: <Icon name="text" />,
      parameters: () => [
        {
          name: 'text',
          label: 'param-text',
          type: 'string',
        },
        {
          name: 'size',
          label: 'param-size',
          type: 'integer',
          unit: '',
        },
        {
          name: 'thickness',
          label: 'param-thickness',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'font',
          label: 'param-font',
          type: 'select',
          options: [
            {
              labelId: 'roboto_regular',
              value: 'roboto_regular',
            },
            {
              labelId: 'audiowide_regular',
              value: 'audiowide_regular',
            },
            {
              labelId: 'fredoka_one_regular',
              value: 'fredoka_one_regular',
            },
            {
              labelId: 'merriweather_regular',
              value: 'merriweather_regular',
            },
            {
              labelId: 'pressstart2p_regular',
              value: 'pressstart2p_regular',
            },
          ],
        },
      ],
    },
    {
      name: 'Union',
      label: 'object-type-union',
      icon: <Icon name="union" />,
      canUndo: true,
      undoLabel: 'menu-undo-union',
      parameters: () => [],
    },
    {
      name: 'Difference',
      label: 'object-type-difference',
      icon: <Icon name="difference" />,
      canUndo: true,
      undoLabel: 'menu-undo-difference',
      showBaseObject: true,
      parameters: () => [],
    },
    {
      name: 'Intersection',
      label: 'object-type-intersection',
      icon: <Icon name="intersection" />,
      canUndo: true,
      undoLabel: 'menu-undo-intersection',
      parameters: () => [],
    },
    {
      name: 'ObjectsGroup',
      label: 'object-type-group',
      icon: <Icon name="group" />,
      canUngroup: true,
      withoutColor: true,
      parameters: () => [],
    },
    {
      name: 'RepetitionObject',
      label: 'object-type-repetition',
      icon: <Icon name="repeat" />,
      withoutColor: true,
      canConverToGroup: true,
      canUndo: true,
      undoLabel: 'menu-undo-repetition',
      parameters: ({ parameters: { type } }) => {
        if (type === 'cartesian') {
          return [
            {
              name: 'num',
              label: 'param-repetitions',
              type: 'integer',
            },
            {
              name: 'x',
              label: 'param-x',
              type: 'integer',
              unit: 'mm',
            },
            {
              name: 'y',
              label: 'param-y',
              type: 'integer',
              unit: 'mm',
            },
            {
              name: 'z',
              label: 'param-z',
              type: 'integer',
              unit: 'mm',
            },
          ];
        }
        if (type === 'polar') {
          return [
            {
              name: 'num',
              label: 'param-repetitions',
              type: 'integer',
            },
            {
              name: 'axis',
              label: 'param-axis',
              type: 'select',
              options: [
                {
                  labelId: 'param-x',
                  value: 'x',
                },
                {
                  labelId: 'param-y',
                  value: 'y',
                },
                {
                  labelId: 'param-z',
                  value: 'z',
                },
              ],
            },
            {
              name: 'angle',
              label: 'param-angle',
              type: 'integer',
              unit: '°',
            },
          ];
        }
      },
    },
  ],

  objectOperations: [
    {
      name: 'translation',
      label: 'operation-translation',
      basicLabel: 'operation-position',
      icon: <Icon name="translation" />,
      color: '#dd5b0c',
      create: () => ({
        id: uuid(),
        ...Object3D.createTranslateOperation(0, 0, 0, false),
      }),
      parameters: [
        {
          name: 'relative',
          label: 'param-translation-relative',
          type: 'select',
          advancedMode: true,
          options: [
            {
              labelId: 'param-relative-axis',
              value: true,
            },
            {
              labelId: 'param-absolute-axis',
              value: false,
            },
          ],
        },
        {
          name: 'x',
          label: 'param-x',
          type: 'integer',
          unit: 'mm',
          activeOperation: (object, operation) => ({
            object,
            type: 'translation',
            axis: 'x',
            relative: operation.relative,
          }),
        },
        {
          name: 'y',
          label: 'param-y',
          type: 'integer',
          unit: 'mm',
          activeOperation: (object, operation) => ({
            object,
            type: 'translation',
            axis: 'y',
            relative: operation.relative,
          }),
        },
        {
          name: 'z',
          label: 'param-z',
          type: 'integer',
          unit: 'mm',
          activeOperation: (object, operation) => ({
            object,
            type: 'translation',
            axis: 'z',
            relative: operation.relative,
          }),
        },
      ],
    },
    {
      name: 'rotation',
      label: 'operation-rotation',
      icon: <Icon name="rotation" />,
      color: '#d8af31',
      create: () => ({
        id: uuid(),
        ...Object3D.createRotateOperation(0, 0, 0, false),
      }),
      parameters: [
        {
          name: 'x',
          label: 'param-x',
          type: 'integer',
          unit: '°',
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: 'rotation',
            axis: 'x',
            relative: operation.relative,
          }),
        },
        {
          name: 'y',
          label: 'param-y',
          type: 'integer',
          unit: '°',
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: 'rotation',
            axis: 'y',
            relative: operation.relative,
          }),
        },
        {
          name: 'z',
          label: 'param-z',
          type: 'integer',
          unit: '°',
          basicMode: true,
          activeOperation: (object, operation) => ({
            object,
            type: 'rotation',
            axis: 'z',
            relative: operation.relative,
          }),
        },
        {
          name: 'relative',
          label: 'param-rotation-relative',
          type: 'select',
          advancedMode: true,
          options: [
            {
              labelId: 'param-relative-axis',
              value: true,
            },
            {
              labelId: 'param-absolute-axis',
              value: false,
            },
          ],
        },
        {
          name: 'axis',
          label: 'param-axis',
          type: 'select',
          advancedMode: true,
          options: [
            {
              labelId: 'param-x',
              value: 'x',
            },
            {
              labelId: 'param-y',
              value: 'y',
            },
            {
              labelId: 'param-z',
              value: 'z',
            },
          ],
          getValue: operation => {
            if (operation.x !== 0) {
              return 'x';
            }
            if (operation.y !== 0) {
              return 'y';
            }
            if (operation.z !== 0) {
              return 'z';
            }
          },
          setValue: (operation, value) => {
            const { x, y, z } = operation;
            const angle = x || y || z;
            return {
              ...operation,
              x: value === 'x' ? angle : 0,
              y: value === 'y' ? angle : 0,
              z: value === 'z' ? angle : 0,
              axis: value,
            };
          },
        },
        {
          name: 'angle',
          label: 'param-angle',
          type: 'integer',
          unit: '°',
          advancedMode: true,
          activeOperation: (object, { x, y, z, relative, axis = 'x' }) => ({
            object,
            type: 'rotation',
            axis: (x && 'x') || (y && 'y') || (z && 'z') || axis,
            relative: relative,
          }),
          getValue: operation => {
            const { x, y, z } = operation;
            return x || y || z;
          },
          setValue: (operation, value) => {
            const { x, y, z, axis = 'x' } = operation;
            if (x || y || z) {
              return {
                ...operation,
                x: x ? value : 0,
                y: y ? value : 0,
                z: z ? value : 0,
              };
            } else {
              return {
                ...operation,
                [axis]: value,
              };
            }
          },
        },
      ],
    },
    {
      name: 'scale',
      label: 'operation-scale',
      icon: <Icon name="scale" />,
      color: '#59b52e',
      create: () => ({
        id: uuid(),
        ...Object3D.createScaleOperation(1, 1, 1),
      }),
      parameters: [
        {
          name: 'x',
          label: 'param-x',
          type: 'integer',
        },
        {
          name: 'y',
          label: 'param-y',
          type: 'integer',
        },
        {
          name: 'z',
          label: 'param-z',
          type: 'integer',
        },
      ],
    },
    {
      name: 'mirror',
      label: 'operation-reflection',
      icon: <Icon name="reflection" />,
      color: '#00c1c7',
      create: () => Object3D.createMirrorOperation(),
      parameters: [
        {
          name: 'plane',
          label: 'param-plane',
          type: 'select',
          options: [
            {
              labelId: 'param-x-y',
              value: 'xy',
            },
            {
              labelId: 'param-y-z',
              value: 'yz',
            },
            {
              labelId: 'param-z-x',
              value: 'zx',
            },
          ],
        },
      ],
    },
  ],

  defaultOperations: isAdvancedMode => {
    if (isAdvancedMode) {
      return [];
    } else {
      return [
        Object3D.createTranslateOperation(0, 0, 0, false),
        Object3D.createRotateOperation(0, 0, 0, true),
        Object3D.createScaleOperation(1, 1, 1),
      ];
    }
  },

  compositionOperations: [
    {
      name: 'Union',
      label: 'operation-union',
      icon: <Icon name="union" />,
      minObjects: 2,
      create: children => ({
        id: uuid(),
        type: 'Union',
        children,
        operations: [],
      }),
    },
    {
      name: 'Difference',
      label: 'operation-difference',
      icon: <Icon name="difference" />,
      minObjects: 2,
      create: children => ({
        id: uuid(),
        type: 'Difference',
        children,
        operations: [],
      }),
    },
    {
      name: 'Intersection',
      label: 'operation-intersection',
      icon: <Icon name="intersection" />,
      minObjects: 2,
      create: children => ({
        id: uuid(),
        type: 'Intersection',
        children,
        operations: [],
      }),
    },
    {
      name: 'ObjectsGroup',
      label: 'operation-group',
      icon: <Icon name="group" />,
      minObjects: 2,
      advancedMode: true,
      create: children => ({
        id: uuid(),
        type: 'ObjectsGroup',
        children,
        operations: [],
      }),
    },
    {
      name: 'CartesianRepetition',
      label: 'operation-repeat',
      icon: <Icon name="repeat" />,
      minObjects: 1,
      maxObjects: 1,
      advancedMode: true,
      create: children => ({
        type: 'RepetitionObject',
        children,
        parameters: {
          type: 'cartesian',
          num: 2,
          x: 10,
          y: 10,
          z: 10,
        },
        operations: [],
      }),
    },
    {
      name: 'PolarRepetition',
      label: 'operation-repeat-polar',
      icon: <Icon name="repeat-polar" />,
      minObjects: 1,
      maxObjects: 1,
      advancedMode: true,
      create: children => ({
        type: 'RepetitionObject',
        children,
        parameters: {
          type: 'polar',
          num: 4,
          axis: 'x',
          angle: 180,
        },
        operations: [],
      }),
    },
  ],
};

export default config;
