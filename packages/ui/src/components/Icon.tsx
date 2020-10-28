import * as React from "react";
import AddDocument from "./icons/AddDocument";
import Airplane from "./icons/Airplane";
import AirplaneDocument from "./icons/AirplaneDocument";
import Angle from "./icons/Angle";
import AngleDouble from "./icons/AngleDouble";
import Arrow from "./icons/Arrow";
import ArrowLeft from "./icons/ArrowLeft";
import At from "./icons/At";
import BasicShapes from "./icons/BasicShapes";
import Board from "./icons/Board";
import BoardNotFound from "./icons/BoardNotFound";
import Brush from "./icons/Brush";
import Center from "./icons/Center";
import CityElements from "./icons/CityElements";
import Clock from "./icons/Clock";
import Close from "./icons/Close";
import CloudLogo from "./icons/CloudLogo";
import Code from "./icons/Code";
import Column from "./icons/Column";
import Cone from "./icons/Cone";
import Crotchet from "./icons/Crotchet";
import Crown from "./icons/Crown";
import Cthulhito from "./icons/Cthulhito";
import Cube from "./icons/Cube";
import CurveAngle from "./icons/CurveAngle";
import Cylinder from "./icons/Cylinder";
import Description from "./icons/Description";
import Difference from "./icons/Difference";
import Difficulty from "./icons/Difficulty";
import Document from "./icons/Document";
import Download from "./icons/Download";
import DownloadDocument from "./icons/DownloadDocument";
import Drag from "./icons/Drag";
import DragFile from "./icons/DragFile";
import Dropdown from "./icons/Dropdown";
import Duplicate from "./icons/Duplicate";
import Earth from "./icons/Earth";
import Ellipsis from "./icons/Ellipsis";
import Equal from "./icons/Equal";
import ExerciseResources from "./icons/ExerciseResources";
import ExportSTL from "./icons/ExportSTL";
import Eye from "./icons/Eye";
import EyeClose from "./icons/EyeClose";
import Flag from "./icons/Flag";
import Folder from "./icons/Folder";
import FullScreen from "./icons/FullScreen";
import Group from "./icons/Group";
import Hardware from "./icons/Hardware";
import HardwareQuestion from "./icons/HardwareQuestion";
import Heart from "./icons/Heart";
import HollowCylinder from "./icons/HollowCylinder";
import ImportSTL from "./icons/ImportSTL";
import Info from "./icons/Info";
import Interrogation from "./icons/Interrogation";
import Intersection from "./icons/Intersection";
import LedOn from "./icons/LedOn";
import Logo3D from "./icons/Logo3D";
import LogoApps from "./icons/LogoApps";
import LogoRobotics from "./icons/LogoRobotics";
import LogoCode from "./icons/LogoCode";
import LogoJunior from "./icons/LogoJunior";
import Loop from "./icons/Loop";
import Minim from "./icons/Minim";
import Minus from "./icons/Minus";
import MoveDocument from "./icons/MoveDocument";
import NewDocument from "./icons/NewDocument";
import NewFolder from "./icons/NewFolder";
import Octahedron from "./icons/Octahedron";
import OpenDocument from "./icons/OpenDocument";
import Orthographic from "./icons/Orthographic";
import PadlockClose from "./icons/PadlockClose";
import PadlockOpen from "./icons/PadlockOpen";
import Pencil from "./icons/Pencil";
import People from "./icons/People";
import Perspective from "./icons/Perspective";
import Play from "./icons/Play";
import Plus from "./icons/Plus";
import Prism from "./icons/Prism";
import Programming from "./icons/Programming";
import Programming2 from "./icons/Programming2";
import Programming3 from "./icons/Programming3";
import ProgrammingBloqs from "./icons/ProgrammingBloqs";
import ProgrammingBoard from "./icons/ProgrammingBoard";
import ProgrammingDiagram from "./icons/ProgrammingDiagram";
import ProgrammingDuplicate from "./icons/ProgrammingDuplicate";
import ProgrammingPreview from "./icons/ProgrammingPreview";
import ProgrammingQuestion from "./icons/ProgrammingQuestion";
import ProgrammingUpload from "./icons/ProgrammingUpload";
import Publish from "./icons/Publish";
import Pyramid from "./icons/Pyramid";
import Quaver from "./icons/Quaver";
import RectangularPrism from "./icons/RectangularPrism";
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
import Robot from "./icons/Robot";
import Rotation from "./icons/Rotation";
import Scale from "./icons/Scale";
import Semibreve from "./icons/Semibreve";
import Semiquaver from "./icons/Semiquaver";
import SemiCylinder from "./icons/SemiCylinder";
import Sphere from "./icons/Sphere";
import Spinner from "./icons/Spinner";
import SpinnerSmall from "./icons/SpinnerSmall";
import Star from "./icons/Star";
import Stop from "./icons/Stop";
import STL from "./icons/STL";
import Text from "./icons/Text";
import ThreeD from "./icons/ThreeD";
import Tick from "./icons/Tick";
import TickCircle from "./icons/TickCircle";
import Times from "./icons/Times";
import Torus from "./icons/Torus";
import Translation from "./icons/Translation";
import Trash from "./icons/Trash";
import Triangle from "./icons/Triangle";
import TruncatedCone from "./icons/TruncatedCone";
import Undo from "./icons/Undo";
import Ungroup from "./icons/Ungroup";
import Union from "./icons/Union";
import User from "./icons/User";
import ViewDocument from "./icons/ViewDocument";

export interface IIconProps {
  /** Name of the icon to display */
  name: string;
  className?: string;
}

/**
 * Icon component that renders an svg from a catalog of icons
 */
const Icon: React.SFC<IIconProps> = ({ name, className }) => {
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
    case "heart":
      return <Heart className={className} />;
    case "tube":
      return <HollowCylinder className={className} />;
    case "arrow":
      return <Arrow className={className} />;
    case "arrow-left":
      return <ArrowLeft className={className} />;
    case "at":
      return <At className={className} />;
    case "basic-shapes":
      return <BasicShapes className={className} />;
    case "board":
      return <Board className={className} />;
    case "board-not-found":
      return <BoardNotFound className={className} />;
    case "brush":
      return <Brush className={className} />;
    case "city-elements":
      return <CityElements className={className} />;
    case "clock":
      return <Clock className={className} />;
    case "close":
      return <Close className={className} />;
    case "cloud-logo":
      return <CloudLogo className={className} />;
    case "code":
      return <Code className={className} />;
    case "column":
      return <Column className={className} />;
    case "crotchet":
      return <Crotchet className={className} />;
    case "crown":
      return <Crown className={className} />;
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
    case "drag-file":
      return <DragFile className={className} />;
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
    case "exercise-resources":
      return <ExerciseResources className={className} />;
    case "export-stl":
      return <ExportSTL className={className} />;
    case "eye":
      return <Eye className={className} />;
    case "eye-close":
      return <EyeClose className={className} />;
    case "flag":
      return <Flag className={className} />;
    case "full-screen":
      return <FullScreen className={className} />;
    case "group":
      return <Group className={className} />;
    case "hardware":
      return <Hardware className={className} />;
    case "hardware-question":
      return <HardwareQuestion className={className} />;
    case "import-stl":
      return <ImportSTL className={className} />;
    case "info":
      return <Info className={className} />;
    case "interrogation":
      return <Interrogation className={className} />;
    case "intersection":
      return <Intersection className={className} />;
    case "center":
      return <Center className={className} />;
    case "led-on":
      return <LedOn className={className} />;
    case "loop":
      return <Loop className={className} />;
    case "minim":
      return <Minim className={className} />;
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
    case "play":
      return <Play className={className} />;
    case "plus":
      return <Plus className={className} />;
    case "prism":
      return <Prism className={className} />;
    case "torus":
      return <Torus className={className} />;
    case "star":
      return <Star className={className} />;
    case "stop":
      return <Stop className={className} />;
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
    case "programming-bloqs":
      return <ProgrammingBloqs className={className} />;
    case "programming-board":
      return <ProgrammingBoard className={className} />;
    case "programming-diagram":
      return <ProgrammingDiagram className={className} />;
    case "programming-duplicate":
      return <ProgrammingDuplicate className={className} />;
    case "programming-preview":
      return <ProgrammingPreview className={className} />;
    case "programming-question":
      return <ProgrammingQuestion className={className} />;
    case "programming-upload":
      return <ProgrammingUpload className={className} />;
    case "text":
      return <Text className={className} />;
    case "pyramid":
      return <Pyramid className={className} />;
    case "publish":
      return <Publish className={className} />;
    case "quaver":
      return <Quaver className={className} />;
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
    case "robot":
      return <Robot className={className} />;
    case "rotation":
      return <Rotation className={className} />;
    case "scale":
      return <Scale className={className} />;
    case "sphere":
      return <Sphere className={className} />;
    case "semibreve":
      return <Semibreve className={className} />;
    case "semiquaver":
      return <Semiquaver className={className} />;
    case "semiCylinder":
      return <SemiCylinder className={className} />;
    case "spinner":
      return <Spinner className={className} />;
    case "spinner-small":
      return <SpinnerSmall className={className} />;
    case "stl":
      return <STL className={className} />;
    case "threed":
      return <ThreeD className={className} />;
    case "tick":
      return <Tick className={className} />;
    case "tick-circle":
      return <TickCircle className={className} />;
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
    case "user":
      return <User className={className} />;
    case "view-document":
      return <ViewDocument className={className} />;
    case "logo-3d":
      return <Logo3D className={className} />;
    case "logo-robotics":
      return <LogoRobotics className={className} />;
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
    case "folder":
      return <Folder className={className} />;
    default:
      // tslint:disable-next-line:no-console
      console.warn("Icon not found");
      return null;
  }
};

export default React.memo(Icon);
