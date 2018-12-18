import React from 'react';
import uuid from 'uuid/v1';
import Object3D from '../lib/object3dts/Object3D';

import {Icon} from '@bitbloq/ui';

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

  objectTypes: [
    {
      name: 'Cube',
      label: 'Cube',
      icon: <Icon name="cube" />,
      parameters: () => [
        {
          name: 'width',
          label: 'Width',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
        {
          name: 'depth',
          label: 'Depth',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'Cube',
        parameters: {
          width: 10,
          height: 10,
          depth: 10,
        },
        operations: [],
      }),
    },
    {
      name: 'Sphere',
      label: 'Sphere',
      icon: <Icon name="sphere" />,
      parameters: () => [
        {
          name: 'radius',
          label: 'Radius',
          type: 'integer',
          unit: 'mm',
          min: 0,
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'Sphere',
        parameters: {
          radius: 5,
        },
        operations: [],
      }),
    },
    {
      name: 'Cylinder',
      label: 'Cylinder',
      icon: <Icon name="cylinder" />,
      parameters: () => [
        {
          name: 'r0',
          label: 'Radius Bottom',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'r1',
          label: 'Radius Top',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
          unit: 'mm',
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'Cylinder',
        parameters: {
          r0: 5,
          r1: 5,
          height: 10,
        },
        operations: [],
      }),
    },
    {
      name: 'Prism',
      label: 'Prism',
      icon: <Icon name="prism" />,
      parameters: () => [
        {
          name: 'sides',
          label: 'Number of sides',
          type: 'integer',
        },
        {
          name: 'length',
          label: 'Length of sides',
          type: 'integer',
          unit: 'mm',
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
          unit: 'mm',
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'Prism',
        parameters: {
          sides: 6,
          length: 5,
          height: 15,
        },
        operations: [],
      }),
    },
    {
      name: 'STLObject',
      label: 'STL Object',
      icon: <Icon name="stl" />,
      parameters: () => [
        {
          name: 'geometry',
          label: 'File',
          type: 'file',
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'STLObject',
        parameters: {
          geometry: 0,
        },
        operations: [],
      }),
    },
    {
      name: 'Union',
      label: 'Union',
      icon: <Icon name="union" />,
      canUndo: true,
      undoLabel: 'Undo union',
      parameters: () => [],
    },
    {
      name: 'Difference',
      label: 'Difference',
      icon: <Icon name="difference" />,
      canUndo: true,
      undoLabel: 'Undo difference',
      showBaseObject: true,
      parameters: () => [],
    },
    {
      name: 'Intersection',
      label: 'Intersection',
      icon: <Icon name="intersection" />,
      canUndo: true,
      undoLabel: 'Undo intersection',
      parameters: () => [],
    },
    {
      name: 'ObjectsGroup',
      label: 'Group',
      icon: <Icon name="group" />,
      canUngroup: true,
      withoutColor: true,
      parameters: () => [],
    },
    {
      name: 'RepetitionObject',
      label: 'Repetition',
      icon: <Icon name="repeat" />,
      withoutColor: true,
      canConverToGroup: true,
      parameters: ({parameters: {type}}) => {
        if (type === 'cartesian') {
          return [
            {
              name: 'num',
              label: 'Repetitions',
              type: 'integer',
            },
            {
              name: 'x',
              label: 'x',
              type: 'integer',
              unit: 'mm',
            },
            {
              name: 'y',
              label: 'y',
              type: 'integer',
              unit: 'mm',
            },
            {
              name: 'z',
              label: 'z',
              type: 'integer',
              unit: 'mm',
            },
          ];
        }
        if (type === 'polar') {
          return [
            {
              name: 'num',
              label: 'Repetitions',
              type: 'integer',
            },
            {
              name: 'axis',
              label: 'Axis',
              type: 'select',
              options: [
                {
                  label: 'X',
                  value: 'x',
                },
                {
                  label: 'Y',
                  value: 'y',
                },
                {
                  label: 'Z',
                  value: 'z',
                },
              ],
            },
            {
              name: 'angle',
              label: 'Angle',
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
      label: 'Translation',
      basicLabel: 'Position',
      icon: <Icon name="translation" />,
      color: '#dd5b0c',
      create: () => ({
        id: uuid(),
        ...Object3D.createTranslateOperation(0, 0, 0, false),
      }),
      parameters: [
        {
          name: 'relative',
          label: 'Relative',
          type: 'boolean',
          advancedMode: true
        },
        {
          name: 'x',
          label: 'X',
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
          label: 'Y',
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
          label: 'Z',
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
      label: 'Rotation',
      icon: <Icon name="rotation" />,
      color: '#d8af31',
      create: () => ({
        id: uuid(),
        ...Object3D.createRotateOperation(0, 0, 0, false),
      }),
      parameters: [
        {
          name: 'x',
          label: 'X',
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
          label: 'Y',
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
          label: 'Z',
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
          label: 'Relative',
          type: 'boolean',
          advancedMode: true
        },
        {
          name: 'axis',
          label: 'Axis',
          type: 'select',
          advancedMode: true,
          options: [
            {
              label: 'X',
              value: 'x',
            },
            {
              label: 'Y',
              value: 'y',
            },
            {
              label: 'Z',
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
            const {x, y, z} = operation;
            const angle = x || y || z;
            return {
              ...operation,
              x: value === 'x' ? angle : 0,
              y: value === 'y' ? angle : 0,
              z: value === 'z' ? angle : 0,
              axis: value
            };
          }
        },
        {
          name: 'angle',
          label: 'Angle',
          type: 'integer',
          unit: '°',
          advancedMode: true,
          activeOperation: (object, {x, y, z, relative, axis = 'x'}) => ({
            object,
            type: 'rotation',
            axis: (x && 'x') || (y && 'y') || (z && 'z') || axis,
            relative: relative,
          }),
          getValue: operation => {
            const {x, y, z} = operation;
            return x || y || z;
          },
          setValue: (operation, value) => {
            const {x, y, z, axis = 'x'} = operation;
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
          }
        },
      ],
    },
    {
      name: 'scale',
      label: 'Scale',
      icon: <Icon name="scale" />,
      color: '#59b52e',
      create: () => ({
        id: uuid(),
        ...Object3D.createScaleOperation(1, 1, 1),
      }),
      parameters: [
        {
          name: 'x',
          label: 'x',
          type: 'integer',
        },
        {
          name: 'y',
          label: 'y',
          type: 'integer',
        },
        {
          name: 'z',
          label: 'z',
          type: 'integer',
        },
      ],
    },
    {
      name: 'mirror',
      label: 'Reflection',
      icon: <Icon name="reflection" />,
      color: '#00c1c7',
      create: () => Object3D.createMirrorOperation(),
      parameters: [
        {
          name: 'plane',
          label: 'Plane',
          type: 'select',
          options: [
            {
              label: 'X - Y',
              value: 'xy',
            },
            {
              label: 'Y - Z',
              value: 'yz',
            },
            {
              label: 'Z - X',
              value: 'zx',
            },
          ],
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
        Object3D.createScaleOperation(1, 1, 1),
      ];
    }
  },

  compositionOperations: [
    {
      name: 'Union',
      label: 'Union',
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
      label: 'Difference',
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
      label: 'Intersection',
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
      label: 'Group',
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
      label: 'Repeat',
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
      label: 'Repeat Polar',
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
