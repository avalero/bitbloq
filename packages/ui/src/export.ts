import Button from "./components/Button";
import Icon from "./components/Icon";
import Input from "./components/Input";
import Select from "./components/Select";
import ColorPicker from "./components/ColorPicker";
import DialogModal, * as DialogModalModule from "./components/DialogModal";
import Draggable from "./components/Draggable";
import Droppable from "./components/Droppable";
import DragAndDropProvider from "./components/DragAndDropProvider";
import DropDown from "./components/DropDown";
import Checkbox from "./components/Checkbox";
import Tooltip from "./components/Tooltip";
import NumberInput from "./components/NumberInput";
import Switch from "./components/Switch";
import Document, * as DocumentModule from "./components/Document";
import Panel from "./components/Panel";
import HorizontalRule from "./components/HorizontalRule";
import HorizontalTabs from "./components/HorizontalTabs";
import TextArea from "./components/TextArea";
import Option from "./components/Option";
import * as MenuBar from "./components/MenuBar";
import MelodyEditor, * as MelodyEditorModule from "./components/MelodyEditor";
import Modal from "./components/Modal";
import Spinner from "./components/Spinner";
import ScrollableTabs from "./components/ScrollableTabs";
import FileSelectButton from "./components/FileSelectButton";
import LoadingBarOverlay from "./components/LoadingBarOverlay";
import Tabs from "./components/Tabs";
import TranslateProvider, {
  Translate,
  useLanguage,
  useTranslate
} from "./components/TranslateProvider";
import Layout from "./components/Layout";
import JuniorButton from "./components/junior/Button";
import JuniorSwitch from "./components/junior/Switch";
import JuniorNumberInput from "./components/junior/NumberInput";
import JuniorUpDownButton from "./components/junior/UpDownButton";
import useClickOutside from "./hooks/useClickOutside";
import useDraggable from "./hooks/useDraggable";
import useKeyPressed from "./hooks/useKeyPressed";
import useResizeObserver from "./hooks/useResizeObserver";
import baseStyles from "./base-styles";
import colors from "./colors";
import breakpoints from "./breakpoints";

export {
  Button,
  Input,
  Icon,
  Select,
  ColorPicker,
  DialogModal,
  Draggable,
  Droppable,
  DragAndDropProvider,
  DropDown,
  Checkbox,
  Tooltip,
  NumberInput,
  Switch,
  Document,
  Panel,
  HorizontalRule,
  HorizontalTabs,
  TextArea,
  Option,
  TranslateProvider,
  FileSelectButton,
  LoadingBarOverlay,
  Tabs,
  Translate,
  MelodyEditor,
  Modal,
  Spinner,
  ScrollableTabs,
  useLanguage,
  useTranslate,
  Layout,
  useClickOutside,
  useDraggable,
  useKeyPressed,
  useResizeObserver,
  baseStyles,
  colors,
  breakpoints,
  JuniorButton,
  JuniorSwitch,
  JuniorNumberInput,
  JuniorUpDownButton
};

export type IDialogModalProps = DialogModalModule.IDialogModalProps;
export type IMainMenuOption = MenuBar.IMainMenuOption;
export type IDocumentProps = DocumentModule.IDocumentProps;
export type IDocumentTab = DocumentModule.IDocumentTab;
export type IMelodyNote = MelodyEditorModule.IMelodyNote;
