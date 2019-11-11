import * as React from "react";
import AddDocument from "./icons/AddDocument";
import Airplane from "./icons/Airplane";
import AirplaneDocument from "./icons/AirplaneDocument";
import Angle from "./icons/Angle";
import AngleDouble from "./icons/AngleDouble";
import Arrow from "./icons/Arrow";
import ArrowLeft from "./icons/ArrowLeft";
import BasicShapes from "./icons/BasicShapes";
import Brain from "./icons/Brain";
import Brush from "./icons/Brush";
import CityElements from "./icons/CityElements";
import Close from "./icons/Close";
import CloudLogo from "./icons/CloudLogo";
import Cube from "./icons/Cube";
import CurveAngle from "./icons/CurveAngle";
import Cylinder from "./icons/Cylinder";
import Description from "./icons/Description";
import Difference from "./icons/Difference";
import Difficulty from "./icons/Difficulty";
import Download from "./icons/Download";
import Document from "./icons/Document";
import DownloadDocument from "./icons/DownloadDocument";
import Drag from "./icons/Drag";
import Dropdown from "./icons/Dropdown";
import Duplicate from "./icons/Duplicate";
import Earth from "./icons/Earth";
import Ellipsis from "./icons/Ellipsis";
import Equal from "./icons/Equal";
import ExportSTL from "./icons/ExportSTL";
import Eye from "./icons/Eye";
import EyeClose from "./icons/EyeClose";
import Group from "./icons/Group";
import Hardware from "./icons/Hardware";
import ImportSTL from "./icons/ImportSTL";
import Info from "./icons/Info";
import Intersection from "./icons/Intersection";
import Loop from "./icons/Loop";
import Minus from "./icons/Minus";
import Center from "./icons/Center";
import NewDocument from "./icons/NewDocument";
import OpenDocument from "./icons/OpenDocument";
import MoveDocument from "./icons/MoveDocument";
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
import ResourceDeleted from "./icons/ResourceDeleted";
import ResourceImage from "./icons/ResourceImage";
import ResourceObject from "./icons/ResourceObject";
import ResourceSound from "./icons/ResourceSound";
import ResourceVideo from "./icons/ResourceVideo";
import Rotation from "./icons/Rotation";
import Scale from "./icons/Scale";
import Sphere from "./icons/Sphere";
import Spinner from "./icons/Spinner";
import STL from "./icons/STL";
import ThreeD from "./icons/ThreeD";
import Tick from "./icons/Tick";
import Times from "./icons/Times";
import Translation from "./icons/Translation";
import Trash from "./icons/Trash";
import Triangle from "./icons/Triangle";
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
import NewFolder from "./icons/NewFolder";
import Folder from "./icons/Folder";

export interface IconProps {
  /** Name of the icon to display */
  name: string;
  className?: string;
}

/**
 * Icon component that renders an svg from a catalog of icons
 */
const Icon: React.SFC<IconProps> = ({ name, className }) => {
  switch (name) {
    case "add-document":
      return <AddDocument className={className} />;
    case "airplane":
      return <Airplane className={className} />;
    case "airplane-document":
      return <AirplaneDocument className={className} />;
    case "octahedron":
      return <Octahedron className={className} />;
    case "angle":
      return <Angle className={className} />;
    case "angle-double":
      return <AngleDouble className={className} />;
    case "brain":
      return <Brain className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "tube":
      return <HollowCylinder className={className} />;
    case "arrow":
      return <Arrow className={className} />;
    case "arrow-left":
      return <ArrowLeft className={className} />;
    case "basic-shapes":
      return <BasicShapes className={className} />;
    case "brush":
      return <Brush className={className} />;
    case "city-elements":
      return <CityElements className={className} />;
    case "close":
      return <Close className={className} />;
    case "cloud-logo":
      return <CloudLogo className={className} />;
    case "cube":
      return <Cube className={className} />;
    case "curve-angle":
      return <CurveAngle className={className} />;
    case "cylinder":
      return <Cylinder className={className} />;
    case "description":
      return <Description className={className} />;
    case "difference":
      return <Difference className={className} />;
    case "difficulty":
      return <Difficulty className={className} />;
    case "document":
      return <Document className={className} />;
    case "download":
      return <Download className={className} />;
    case "download-document":
      return <DownloadDocument className={className} />;
    case "drag":
      return <Drag className={className} />;
    case "dropdown":
      return <Dropdown className={className} />;
    case "duplicate":
      return <Duplicate className={className} />;
    case "earth":
      return <Earth className={className} />;
    case "ellipsis":
      return <Ellipsis className={className} />;
    case "equal":
      return <Equal className={className} />;
    case "export-stl":
      return <ExportSTL className={className} />;
    case "eye":
      return <Eye className={className} />;
    case "eye-close":
      return <EyeClose className={className} />;
    case "group":
      return <Group className={className} />;
    case "hardware":
      return <Hardware className={className} />;
    case "import-stl":
      return <ImportSTL className={className} />;
    case "info":
      return <Info className={className} />;
    case "intersection":
      return <Intersection className={className} />;
    case "center":
      return <Center className={className} />;
    case "loop":
      return <Loop className={className} />;
    case "minus":
      return <Minus className={className} />;
    case "new-document":
      return <NewDocument className={className} />;
    case "open-document":
      return <OpenDocument className={className} />;
    case "move-document":
      return <MoveDocument className={className} />;
    case "orthographic":
      return <Orthographic className={className} />;
    case "padlock-open":
      return <PadlockOpen className={className} />;
    case "padlock-close":
      return <PadlockClose className={className} />;
    case "people":
      return <People className={className} />;
    case "pencil":
      return <Pencil className={className} />;
    case "perspective":
      return <Perspective className={className} />;
    case "plus":
      return <Plus className={className} />;
    case "prism":
      return <Prism className={className} />;
    case "torus":
      return <Torus className={className} />;
    case "star":
      return <Star className={className} />;
    case "rectangularPrism":
      return <RectangularPrism className={className} />;
    case "cone":
      return <Cone className={className} />;
    case "truncatedcone":
      return <TruncatedCone className={className} />;
    case "programming":
      return <Programming className={className} />;
    case "programming2":
      return <Programming2 className={className} />;
    case "programming3":
      return <Programming3 className={className} />;
    case "text":
      return <Text className={className} />;
    case "pyramid":
      return <Pyramid className={className} />;
    case "publish":
      return <Publish className={className} />;
    case "redo":
      return <Redo className={className} />;
    case "reflection":
      return <Reflection className={className} />;
    case "reload":
      return <Reload className={className} />;
    case "repeat":
      return <Repeat className={className} />;
    case "repeat-polar":
      return <RepeatPolar className={className} />;
    case "resource-deleted":
      return <ResourceDeleted className={className} />;
    case "resource-image":
      return <ResourceImage className={className} />;
    case "resource-object3D":
      return <ResourceObject className={className} />;
    case "resource-sound":
      return <ResourceSound className={className} />;
    case "resource-video":
      return <ResourceVideo className={className} />;
    case "rotation":
      return <Rotation className={className} />;
    case "scale":
      return <Scale className={className} />;
    case "sphere":
      return <Sphere className={className} />;
    case "semiCylinder":
      return <SemiCylinder className={className} />;
    case "spinner":
      return <Spinner className={className} />;
    case "stl":
      return <STL className={className} />;
    case "threed":
      return <ThreeD className={className} />;
    case "tick":
      return <Tick className={className} />;
    case "times":
      return <Times className={className} />;
    case "translation":
      return <Translation className={className} />;
    case "trash":
      return <Trash className={className} />;
    case "triangle":
      return <Triangle className={className} />;
    case "undo":
      return <Undo className={className} />;
    case "ungroup":
      return <Ungroup className={className} />;
    case "union":
      return <Union className={className} />;
    case "view-document":
      return <ViewDocument className={className} />;
    case "logo-3d":
      return <Logo3D className={className} />;
    case "logo-bloqs":
      return <LogoBloqs className={className} />;
    case "logo-junior":
      return <LogoJunior className={className} />;
    case "logo-code":
      return <LogoCode className={className} />;
    case "logo-apps":
      return <LogoApps className={className} />;
    case "cthulhito":
      return <Cthulhito className={className} />;
    case "new-folder":
      return <NewFolder className={className} />;
    case "folder-icon":
      return <Folder className={className} />;
    default:
      console.warn("Icon not found");
      return null;
  }
};

export default React.memo(Icon);
