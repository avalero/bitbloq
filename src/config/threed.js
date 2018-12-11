import React from 'react';
import uuid from 'uuid/v1';

// Object classes
import Cube from '../lib/object3dts/Cube';
import Cylinder from '../lib/object3dts/Cylinder';
import Sphere from '../lib/object3dts/Sphere';
import Object3D from '../lib/object3dts/Object3D';
import Prism from '../lib/object3dts/Prism';
import STLObject from '../lib/object3dts/STLObject';

// Shape Icons
import CubeIcon from '../components/icons/Cube';
import SphereIcon from '../components/icons/Sphere';
import CylinderIcon from '../components/icons/Cylinder';
import PrismIcon from '../components/icons/Prism';
import STLIcon from '../components/icons/STL';

// Operation Icons
import UnionIcon from '../components/icons/Union';
import DifferenceIcon from '../components/icons/Difference';
import IntersectionIcon from '../components/icons/Intersection';
import GroupIcon from '../components/icons/Group';
import RepeatIcon from '../components/icons/Repeat';
import RepeatPolarIcon from '../components/icons/RepeatPolar';

import TranslationIcon from '../components/icons/Translation';
import RotationIcon from '../components/icons/Rotation';
import ScaleIcon from '../components/icons/Scale';
import ReflectionIcon from '../components/icons/Reflection';

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
      icon: <CubeIcon />,
      objectClass: Cube,
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
      icon: <SphereIcon />,
      objectClass: Sphere,
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
      icon: <CylinderIcon />,
      objectClass: Cylinder,
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
      icon: <PrismIcon />,
      objectClass: Prism,
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
      icon: <STLIcon />,
      objectClass: STLObject,
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
      icon: <UnionIcon />,
      canUndo: true,
      undoLabel: 'Undo union',
      parameters: () => [],
    },
    {
      name: 'Difference',
      label: 'Difference',
      icon: <DifferenceIcon />,
      canUndo: true,
      undoLabel: 'Undo difference',
      showBaseObject: true,
      parameters: () => [],
    },
    {
      name: 'Intersection',
      label: 'Intersection',
      icon: <IntersectionIcon />,
      canUndo: true,
      undoLabel: 'Undo intersection',
      parameters: () => [],
    },
    {
      name: 'ObjectsGroup',
      label: 'Group',
      icon: <GroupIcon />,
      withoutColor: true,
      parameters: () => [],
    },
    {
      name: 'RepetitionObject',
      label: 'Repetition',
      icon: <RepeatIcon />,
      withoutColor: true,
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
      icon: <TranslationIcon />,
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
      icon: <RotationIcon />,
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
      icon: <ScaleIcon />,
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
      icon: <ReflectionIcon />,
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

  compositionOperations: [
    {
      name: 'Union',
      label: 'Union',
      icon: <UnionIcon />,
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
      icon: <DifferenceIcon />,
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
      icon: <IntersectionIcon />,
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
      icon: <GroupIcon />,
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
      icon: <RepeatIcon />,
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
      icon: <RepeatPolarIcon />,
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
