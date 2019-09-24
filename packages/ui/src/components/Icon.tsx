import * as React from "react";
import AddDocument from "./icons/AddDocument";
import Airplane from "./icons/Airplane";
import AirplaneDocument from "./icons/AirplaneDocument";
import Angle from "./icons/Angle";
import AngleDouble from "./icons/AngleDouble";
import Arrow from "./icons/Arrow";
import BasicShapes from "./icons/BasicShapes";
import Brush from "./icons/Brush";
import CityElements from "./icons/CityElements";
import Close from "./icons/Close";
import Cube from "./icons/Cube";
import CurveAngle from "./icons/CurveAngle";
import Cylinder from "./icons/Cylinder";
import Difference from "./icons/Difference";
import Difficulty from "./icons/Difficulty";
import Download from "./icons/Download";
import DownloadDocument from "./icons/DownloadDocument";
import Drag from "./icons/Drag";
import Dropdown from "./icons/Dropdown";
import Duplicate from "./icons/Duplicate";
import Earth from "./icons/Earth";
import Ellipsis from "./icons/Ellipsis";
import ExportSTL from "./icons/ExportSTL";
import Group from "./icons/Group";
import Hardware from "./icons/Hardware";
import ImportSTL from "./icons/ImportSTL";
import Info from "./icons/Info";
import Intersection from "./icons/Intersection";
import Minus from "./icons/Minus";
import Center from "./icons/Center";
import NewDocument from "./icons/NewDocument";
import OpenDocument from "./icons/OpenDocument";
import Orthographic from "./icons/Orthographic";
import PadlockClose from "./icons/PadlockClose";
import PadlockOpen from "./icons/PadlockOpen";
import Pencil from "./icons/Pencil";
import Perspective from "./icons/Perspective";
import Plus from "./icons/Plus";
import Prism from "./icons/Prism";
import Text from "./icons/Text";
import People from "./icons/People";
import Programming from "./icons/Programming";
import Programming2 from "./icons/Programming2";
import Programming3 from "./icons/Programming3";
import Pyramid from "./icons/Pyramid";
import Publish from "./icons/Publish";
import Redo from "./icons/Redo";
import Reflection from "./icons/Reflection";
import Reload from "./icons/Reload";
import Repeat from "./icons/Repeat";
import RepeatPolar from "./icons/RepeatPolar";
import Rotation from "./icons/Rotation";
import Scale from "./icons/Scale";
import Sphere from "./icons/Sphere";
import Spinner from "./icons/Spinner";
import STL from "./icons/STL";
import ThreeD from "./icons/ThreeD";
import Tick from "./icons/Tick";
import Translation from "./icons/Translation";
import Trash from "./icons/Trash";
import Undo from "./icons/Undo";
import Ungroup from "./icons/Ungroup";
import Union from "./icons/Union";
import ViewDocument from "./icons/ViewDocument";
import Torus from "./icons/Torus";
import RectangularPrism from "./icons/RectangularPrism";
import Cone from "./icons/Cone";
import TruncatedCone from "./icons/TruncatedCone";
import Star from "./icons/Star";
import SemiCylinder from "./icons/SemiCylinder";
import Octahedron from "./icons/Octahedron";
import Heart from "./icons/Heart";
import Logo3D from "./icons/Logo3D";
import LogoBloqs from "./icons/LogoBloqs";
import LogoJunior from "./icons/LogoJunior";
import LogoApps from "./icons/LogoApps";
import LogoCode from "./icons/LogoCode";
import HollowCylinder from "./icons/HollowCylinder";
import Cthulhito from "./icons/Cthulhito";

export interface IconProps {
  /** Name of the icon to display */
  name: string;
}

/**
 * Icon component that renders an svg from a catalog of icons
 */
const Icon: React.SFC<IconProps> = ({ name }) => {
  switch (name) {
    case "add-document":
      return <AddDocument />;
    case "airplane":
      return <Airplane />;
    case "airplane-document":
      return <AirplaneDocument />;
    case "octahedron":
      return <Octahedron />;
    case "angle":
      return <Angle />;
    case "angle-double":
      return <AngleDouble />;
    case "heart":
      return <Heart />;
    case "tube":
      return <HollowCylinder />;
    case "arrow":
      return <Arrow />;
    case "basic-shapes":
      return <BasicShapes />;
    case "brush":
      return <Brush />;
    case "city-elements":
      return <CityElements />;
    case "close":
      return <Close />;
    case "cube":
      return <Cube />;
    case "curve-angle":
      return <CurveAngle />;
    case "cylinder":
      return <Cylinder />;
    case "difference":
      return <Difference />;
    case "difficulty":
      return <Difficulty />;
    case "download":
      return <Download />;
    case "download-document":
      return <DownloadDocument />;
    case "drag":
      return <Drag />;
    case "dropdown":
      return <Dropdown />;
    case "duplicate":
      return <Duplicate />;
    case "earth":
      return <Earth />;
    case "ellipsis":
      return <Ellipsis />;
    case "export-stl":
      return <ExportSTL />;
    case "group":
      return <Group />;
    case "hardware":
      return <Hardware />;
    case "import-stl":
      return <ImportSTL />;
    case "info":
      return <Info />;
    case "intersection":
      return <Intersection />;
    case "center":
      return <Center />;
    case "minus":
      return <Minus />;
    case "new-document":
      return <NewDocument />;
    case "open-document":
      return <OpenDocument />;
    case "orthographic":
      return <Orthographic />;
    case "padlock-open":
      return <PadlockOpen />;
    case "padlock-close":
      return <PadlockClose />;
    case "people":
      return <People />;
    case "pencil":
      return <Pencil />;
    case "perspective":
      return <Perspective />;
    case "plus":
      return <Plus />;
    case "prism":
      return <Prism />;
    case "torus":
      return <Torus />;
    case "star":
      return <Star />;
    case "rectangularPrism":
      return <RectangularPrism />;
    case "cone":
      return <Cone />;
    case "truncatedcone":
      return <TruncatedCone />;
    case "programming":
      return <Programming />;
    case "programming2":
      return <Programming2 />;
    case "programming3":
      return <Programming3 />;
    case "text":
      return <Text />;
    case "pyramid":
      return <Pyramid />;
    case "publish":
      return <Publish />;
    case "redo":
      return <Redo />;
    case "reflection":
      return <Reflection />;
    case "reload":
      return <Reload />;
    case "repeat":
      return <Repeat />;
    case "repeat-polar":
      return <RepeatPolar />;
    case "rotation":
      return <Rotation />;
    case "scale":
      return <Scale />;
    case "sphere":
      return <Sphere />;
    case "semiCylinder":
      return <SemiCylinder />;
    case "spinner":
      return <Spinner />;
    case "stl":
      return <STL />;
    case "threed":
      return <ThreeD />;
    case "tick":
      return <Tick />;
    case "translation":
      return <Translation />;
    case "trash":
      return <Trash />;
    case "undo":
      return <Undo />;
    case "ungroup":
      return <Ungroup />;
    case "union":
      return <Union />;
    case "view-document":
      return <ViewDocument />;
    case "logo-3d":
      return <Logo3D />;
    case "logo-bloqs":
      return <LogoBloqs />;
    case "logo-junior":
      return <LogoJunior />;
    case "logo-code":
      return <LogoCode />;
    case "logo-apps":
      return <LogoApps />;
    case "cthulhito":
      return <Cthulhito />;
    default:
      console.warn("Icon not found");
      return null;
  }
};

export default Icon;
