// Object classes
import Object3D from '../lib/object3d/Object3D';
import Cube from '../lib/object3d/Cube';
import Sphere from '../lib/object3d/Sphere';
import Cylinder from '../lib/object3d/Cylinder';
import Prism from '../lib/object3d/Prism';
import STLObject from '../lib/object3d/STLObject'
import Union from '../lib/object3d/Union';
import Difference from '../lib/object3d/Difference';
import Intersection from '../lib/object3d/Intersection';

// Shape Icons
import CubeIcon from '../assets/images/cube.svg';
import SphereIcon from '../assets/images/sphere.svg';
import CylinderIcon from '../assets/images/cylinder.svg';
import PrismIcon from '../assets/images/prism.svg';

// Operation Icons
import UnionIcon from '../assets/images/union.svg';
import DifferenceIcon from '../assets/images/subtract.svg';
import IntersectionIcon from '../assets/images/intersection.svg';
import TranslateIcon from '../assets/images/translate.svg';
import RotateIcon from '../assets/images/rotate.svg';
import ScaleIcon from '../assets/images/scale.svg';

const config = {

  shapes: [
    {
      name: 'Cube',
      label: 'Cube',
      icon: CubeIcon,
      objectClass: Cube,
    },
    {
      name: 'Sphere',
      label: 'Sphere',
      icon: SphereIcon,
      objectClass: Sphere,
    },
    {
      name: 'Cylinder',
      label: 'Cylinder',
      icon: CylinderIcon,
      objectClass: Cylinder,
    },
    {
      name: 'Prism',
      label: 'Prism',
      icon: PrismIcon,
      objectClass: Prism,
    },
    {
      name: 'STLObject',
      label: 'STL File',
      icon: PrismIcon,
      objectClass: STLObject,
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
    },
  ],

  compositionOperations: [
    {
      name: 'Union',
      label: 'Union',
      icon: UnionIcon,
      objectClass: Union,
    },
    {
      name: 'Difference',
      label: 'Difference',
      icon: DifferenceIcon,
      objectClass: Difference,
    },
    {
      name: 'Intersection',
      label: 'Intersection',
      icon: IntersectionIcon,
      objectClass: Intersection,
    },
  ],
};

export default config;
