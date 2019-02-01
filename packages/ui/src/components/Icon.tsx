import * as React from 'react'
import Airplane from './icons/Airplane'
import Angle from './icons/Angle'
import AngleDouble from './icons/AngleDouble'
import Arrow from './icons/Arrow'
import Brush from './icons/Brush'
import Close from './icons/Close'
import Cube from './icons/Cube'
import Cylinder from './icons/Cylinder'
import Difference from './icons/Difference'
import Difficulty from './icons/Difficulty'
import Download from './icons/Download'
import Drag from './icons/Drag'
import Dropdown from './icons/Dropdown'
import Duplicate from './icons/Duplicate'
import Ellipsis from './icons/Ellipsis'
import Group from './icons/Group'
import Info from './icons/Info'
import Intersection from './icons/Intersection'
import Minus from './icons/Minus'
import Center from './icons/Center'
import NewDocument from './icons/NewDocument'
import Orthographic from './icons/Orthographic'
import Pencil from './icons/Pencil'
import Perspective from './icons/Perspective'
import Plus from './icons/Plus'
import Prism from './icons/Prism'
import Text from './icons/Text'
import Pyramid from './icons/Pyramid'
import Publish from './icons/Publish'
import Redo from './icons/Redo'
import Reflection from './icons/Reflection'
import Repeat from './icons/Repeat'
import RepeatPolar from './icons/RepeatPolar'
import Rotation from './icons/Rotation'
import Scale from './icons/Scale'
import Sphere from './icons/Sphere'
import Spinner from './icons/Spinner'
import STL from './icons/STL'
import ThreeD from './icons/ThreeD'
import Tick from './icons/Tick'
import Translation from './icons/Translation'
import Trash from './icons/Trash'
import Undo from './icons/Undo'
import Ungroup from './icons/Ungroup'
import Union from './icons/Union'

export interface IconProps {
  /** Name of the icon to display */
  name: string;
}

/**
 * Icon component that renders an svg from a catalog of icons
 */
const Icon: React.SFC<IconProps> = ({name}) => {
  switch(name) {
    case 'airplane':
      return <Airplane />;
    case 'angle':
      return <Angle />;
    case 'angle-double':
      return <AngleDouble />;
    case 'arrow':
      return <Arrow />;
    case 'brush':
      return <Brush />;
    case 'close':
      return <Close />;
    case 'cube':
      return <Cube />;
    case 'cylinder':
      return <Cylinder />;
    case 'difference':
      return <Difference />;
    case 'difficulty':
      return <Difficulty />;
    case 'download':
      return <Download />;
    case 'drag':
      return <Drag />;
    case 'dropdown':
      return <Dropdown />;
    case 'duplicate':
      return <Duplicate />;
    case 'ellipsis':
      return <Ellipsis />;
    case 'group':
      return <Group />;
    case 'info':
      return <Info />;
    case 'intersection':
      return <Intersection />;
    case 'center':
      return <Center />;
    case 'minus':
      return <Minus />;
    case 'new-document':
      return <NewDocument />;
    case 'orthographic':
      return <Orthographic />;
    case 'pencil':
      return <Pencil />;
    case 'perspective':
      return <Perspective />;
    case 'plus':
      return <Plus />;
    case 'prism':
      return <Prism />;
    case 'text':
      return <Text />;
    case 'pyramid':
      return <Pyramid />;
    case 'publish':
      return <Publish />;
    case 'redo':
      return <Redo />;
    case 'reflection':
      return <Reflection />;
    case 'repeat':
      return <Repeat />;
    case 'repeat-polar':
      return <RepeatPolar />;
    case 'rotation':
      return <Rotation />;
    case 'scale':
      return <Scale />;
    case 'sphere':
      return <Sphere />;
    case 'spinner':
      return <Spinner />;
    case 'stl':
      return <STL />;
    case 'threed':
      return <ThreeD />;
    case 'tick':
      return <Tick />;
    case 'translation':
      return <Translation />;
    case 'trash':
      return <Trash />;
    case 'undo':
      return <Undo />;
    case 'ungroup':
      return <Ungroup />;
    case 'union':
      return <Union />;
    default:
      console.warn('Icon not found');
      return null;
  }
}

export default Icon;
