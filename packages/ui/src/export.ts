import Button from "./components/Button";
import Icon from "./components/Icon";
import Input from "./components/Input";
import Select from "./components/Select";
import ColorPicker from "./components/ColorPicker";
import DialogModal, { DialogModalProps } from "./components/DialogModal";
import DropDown from "./components/DropDown";
import Checkbox from "./components/Checkbox";
import Tooltip from "./components/Tooltip";
import NumberInput from "./components/NumberInput";
import Switch from "./components/Switch";
import Document, * as DocumentModule from "./components/Document";
import Panel from "./components/Panel";
import HorizontalRule from "./components/HorizontalRule";
import TextArea from "./components/TextArea";
import Option from "./components/Option";
import * as MenuBar from "./components/MenuBar";
import Modal from "./components/Modal";
import Spinner from "./components/Spinner";
import ScrollableTabs from "./components/ScrollableTabs";
import FileSelectButton from "./components/FileSelectButton";
import LoadingBarOverlay from "./components/LoadingBarOverlay";
import TranslateProvider, {
  Translate,
  TranslateFn,
  withTranslate,
  useTranslate
} from "./components/TranslateProvider";
import useKeyPressed from "./hooks/useKeyPressed";
import baseStyles from "./base-styles";
import colors from "./colors";

import JuniorButton from "./components/junior/Button";
import JuniorSwitch from "./components/junior/Switch";
import JuniorNumberInput from "./components/junior/NumberInput";

import { IHeaderButton } from "./types";

export {
  Button,
  Input,
  Icon,
  Select,
  ColorPicker,
  DialogModal,
  DropDown,
  Checkbox,
  Tooltip,
  NumberInput,
  Switch,
  Document,
  Panel,
  HorizontalRule,
  TextArea,
  Option,
  TranslateProvider,
  FileSelectButton,
  LoadingBarOverlay,
  Translate,
  Modal,
  Spinner,
  ScrollableTabs,
  withTranslate,
  useTranslate,
  useKeyPressed,
  baseStyles,
  colors,
  JuniorButton,
  JuniorSwitch,
  JuniorNumberInput
};

export type DialogModalProps = DialogModalProps;
export type TranslateFn = TranslateFn;
export type IHeaderButton = IHeaderButton;
export type IMainMenuOption = MenuBar.IMainMenuOption;
export type IDocumentProps = DocumentModule.IDocumentProps;
export type IDocumentTab = DocumentModule.IDocumentTab;
