import React from 'react';
import uuid from 'uuid/v1';

// Object classes
import Cube from '../lib/object3dts/Cube';
import Cylinder from '../lib/object3dts/Cylinder';
import Sphere from '../lib/object3dts/Sphere';
import {Object3D} from '../lib/object3dts/Object3D';
import Prism from '../lib/object3dts/Prism';
import STLObject from '../lib/object3dts/STLObject'

import Union from '../lib/object3dts/Union';
import Difference from '../lib/object3dts/Difference';
import Intersection from '../lib/object3dts/Intersection';

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

import TranslateIcon from '../assets/images/translate.svg';
import RotateIcon from '../assets/images/rotate.svg';
import ScaleIcon from '../assets/images/scale.svg';

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

  shapes: [
    {
      name: 'Cube',
      label: 'Cube',
      icon: <CubeIcon />,
      objectClass: Cube,
      parameters: [
        {
          name: 'width',
          label: 'Width',
          type: 'integer',
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
        },
        {
          name: 'depth',
          label: 'Depth',
          type: 'integer',
        },
      ],
      create: () => ({
        id: uuid(),
        type: 'Cube',
        parameters: {
          width: 10, height: 10, depth: 10 
        },
        operations: [],
      }),
    },
    {
      name: 'Sphere',
      label: 'Sphere',
      icon: <SphereIcon />,
      objectClass: Sphere,
      parameters: [
        {
          name: 'radius',
          label: 'Radius',
          type: 'integer',
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
      parameters: [
        {
          name: 'r0',
          label: 'Radius Bottom',
          type: 'integer',
        },
        {
          name: 'r1',
          label: 'Radius Top',
          type: 'integer',
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
        }
      ],
      create: () => ({
        id: uuid(),
        type: 'Cylinder',
        parameters: {
          r0: 5, r1: 5, height: 10,
        },
        operations: []
      }),
    },
    {
      name: 'Prism',
      label: 'Prism',
      icon: <PrismIcon />,
      objectClass: Prism,
      parameters: [
        {
          name: 'sides',
          label: 'Number of sides',
          type: 'integer',
        },
        {
          name: 'length',
          label: 'Length of sides',
          type: 'integer',
        },
        {
          name: 'height',
          label: 'Height',
          type: 'integer',
        }
      ],
      create: () => ({
        id: uuid(),
        type: 'Prism',
        parameters: {
          sides: 5, length: 5, height: 15,
        },
        operations: []
      }),
    },
    {
      name: 'STLObject',
      label: 'STL Object',
      icon: <STLIcon />,
      objectClass: STLObject,
      parameters: [
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
        operations: []
      }),
    },
  ],

  objectOperations: [
    {
      name: 'translation',
      label: 'Translate',
      icon: TranslateIcon,
      create: () => Object3D.createTranslateOperation(0, 0, 0, false),
      parameters: [
        {
          name: 'relative',
          label: 'Relative',
          type: 'boolean',
        },
        {
          name: 'x',
          label: 'X',
          type: 'integer',
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
      label: 'Rotate',
      icon: RotateIcon,
      create: () => Object3D.createRotateOperation('x', 0, false),
      parameters: [
        {
          name: 'relative',
          label: 'Relative',
          type: 'boolean',
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
          activeOperation: (object, operation) => ({
            object,
            type: 'rotation',
            axis: operation.axis,
            relative: operation.relative,
          }),
        },
      ],
    },
    {
      name: 'scale',
      label: 'Scale',
      icon: ScaleIcon,
      create: () => Object3D.createScaleOperation(1, 1, 1),
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
  ],

  compositionOperations: [
    {
      name: 'Union',
      label: 'Union',
      icon: <UnionIcon />,
      objectClass: Union,
      canApply: (children) => children.length > 1,
      create: (children) => ({
        id: uuid(),
        type: 'Union',
        parameters: {
          children
        },
        operations: []
      })
    },
    {
      name: 'Difference',
      label: 'Difference',
      icon: <DifferenceIcon />,
      canApply: (children) => children.length > 1,
      objectClass: Difference,
      create: (children) => ({
        id: uuid(),
        type: 'Difference',
        parameters: {
          children
        },
        operations: []
      })
    },
    {
      name: 'Intersection',
      label: 'Intersection',
      icon: <IntersectionIcon />,
      canApply: (children) => children.length > 1,
      objectClass: Intersection,
      create: (children) => ({
        id: uuid(),
        type: 'Intersection',
        parameters: {
          children
        },
        operations: []
      })
    },
  ],
};

export default config;
