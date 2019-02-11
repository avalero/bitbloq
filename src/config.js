import {colors, Icon} from '@bitbloq/ui';

import carIcon from './images/car.svg';
import busIcon from './images/bus.svg';
import pickupIcon from './images/pickup.svg';
import vanIcon from './images/van.svg';
import truckIcon from './images/truck.svg';
import helicopterIcon from './images/helicopter.svg';
import tree1Icon from './images/tree-1.svg';
import tree2Icon from './images/tree-2.svg';
import streetlightIcon from './images/streetlight.svg';
import trafficlightIcon from './images/trafficlight.svg';
import trafficSign1Icon from './images/traffic-sign-1.svg';
import trafficSign2Icon from './images/traffic-sign-2.svg';
import trafficSign3Icon from './images/traffic-sign-3.svg';
import windmillIcon from './images/windmill.svg';
import building1Icon from './images/building-1.svg';
import building2Icon from './images/building-2.svg';
import building3Icon from './images/building-3.svg';
import building4Icon from './images/building-4.svg';

import carJson from './json/3d/car.json';
import busJson from './json/3d/bus.json';
import pickupJson from './json/3d/pickup.json';
import vanJson from './json/3d/van.json';
import truckJson from './json/3d/truck.json';
import helicopterJson from './json/3d/helicopter.json';
import tree1Json from './json/3d/tree-1.json';
import tree2Json from './json/3d/tree-2.json';
import streetlightJson from './json/3d/streetlight.json';
import trafficlightJson from './json/3d/trafficlight.json';
import trafficSign1Json from './json/3d/traffic-sign-1.json';
import trafficSign2Json from './json/3d/traffic-sign-2.json';
import trafficSign3Json from './json/3d/traffic-sign-3.json';
import windmillJson from './json/3d/windmill.json';
import building1Json from './json/3d/building-1.json';
import building2Json from './json/3d/building-2.json';
import building3Json from './json/3d/building-3.json';
import building4Json from './json/3d/building-4.json';

export const documentTypes = {
  'bloqs': {
    label: 'Robótica por bloques',
    shortLabel: 'Robótica',
    color: colors.green,
    supported: false
  },
  '3d': {
    label: 'Diseño 3D',
    shortLabel: 'Diseño 3D',
    color: colors.brandBlue,
    supported: true
  },
  'code': {
    label: 'Robótica por código',
    shortLabel: 'Código',
    color: colors.brandPink,
    supported: false
  },
  'events': {
    label: 'Robótica por eventos',
    shortLabel: 'Eventos',
    color: colors.brandOrange,
    supported: false
  },
  'apps': {
    label: 'Diseño y programación de Apps',
    shortLabel: 'Apps móviles',
    color: colors.brandYellow,
    supported: false
  }
};

export const addShapeGroups = [
  {
    label: 'city-elements',
    icon: <Icon name="city-elements" />,
    shapes: [
      {
        ...carJson,
        label: 'shape-car',
        icon: <img src={carIcon} />,
      },
      {
        ...busJson,
        label: 'shape-bus',
        icon: <img src={busIcon} />,
      },
      {
        ...pickupJson,
        label: 'shape-pickup',
        icon: <img src={pickupIcon} />,
      },
      {
        ...vanJson,
        label: 'shape-van',
        icon: <img src={vanIcon} />,
      },
      {
        ...truckJson,
        label: 'shape-truck',
        icon: <img src={truckIcon} />,
      },
      {
        ...helicopterJson,
        label: 'shape-helicopter',
        icon: <img src={helicopterIcon} />,
      },
      {
        ...tree1Json,
        label: 'shape-tree-1',
        icon: <img src={tree1Icon} />,
      },
      {
        ...tree2Json,
        label: 'shape-tree-2',
        icon: <img src={tree2Icon} />,
      },
      {
        ...streetlightJson,
        label: 'shape-streetlight',
        icon: <img src={streetlightIcon} />,
      },
      {
        ...trafficlightJson,
        label: 'shape-trafficlight',
        icon: <img src={trafficlightIcon} />,
      },
      {
        ...trafficSign1Json,
        label: 'shape-traffic-sign-1',
        icon: <img src={trafficSign1Icon} />,
      },
      {
        ...trafficSign2Json,
        label: 'shape-traffic-sign-2',
        icon: <img src={trafficSign2Icon} />,
      },
      {
        ...trafficSign3Json,
        label: 'shape-traffic-sign-3',
        icon: <img src={trafficSign3Icon} />,
      },
      {
        ...windmillJson,
        label: 'shape-windmill',
        icon: <img src={windmillIcon} />,
      },
    ]
  },
  {
    label: 'people',
    icon: <Icon name="people" />,
    shapes: [
      {
        ...building1Json,
        label: 'shape-building-1',
        icon: <img src={building1Icon} />,
      },
      {
        ...building2Json,
        label: 'shape-building-2',
        icon: <img src={building2Icon} />,
      },
      {
        ...building3Json,
        label: 'shape-building-3',
        icon: <img src={building3Icon} />,
      },
      {
        ...building4Json,
        label: 'shape-building-4',
        icon: <img src={building4Icon} />,
      },
    ]
  }
];
