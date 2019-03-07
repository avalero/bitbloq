import * as React from "react";
import { ThreeD } from "@bitbloq/3d";
import { colors, Icon, withTranslate } from "@bitbloq/ui";
import { addShapeGroups } from "../config";
import BrowserVersionWarning from "./BrowserVersionWarning";
import { getChromeVersion } from "../util";

const getMenuOptions = (baseMenuOptions, t) => [
  {
    id: "file",
    label: t("menu-file"),
    children: [
      {
        id: "download-document",
        label: t("menu-download-document"),
        icon: <Icon name="download" />
      },
      {
        id: "download-stl",
        label: t("menu-download-stl"),
        icon: <Icon name="threed" />
      }
    ]
  },
  ...baseMenuOptions
];

interface ThreeDEditorProps {
  t: (string) => string;
  brandColor: string;
  content: any;
  tabIndex: number;
  onTabChange: (number) => any;
  getTabs: (any) => any;
  title: string;
  onSaveDocument?: () => any;
  onContentChange: (any) => any;
  canEditTitle?: boolean;
  onEditTitle?: () => any;
  headerButtons?: BBUI.HeaderButton[];
  onHeaderButtonClick?: BBUI.HeaderButtonClickCallback;
}

class ThreeDEditor extends React.Component<ThreeDEditorProps> {
  threedRef = React.createRef<ThreeD>();

  onMenuOptionClick = option => {
    const { onSaveDocument } = this.props;

    switch (option.id) {
      case "download-document":
        onSaveDocument();
        return;

      case "download-stl":
        this.threedRef.current.exportToSTL();
        return;

      default:
        return;
    }
  };

  render() {
    const {
      content,
      brandColor,
      tabIndex,
      onTabChange,
      getTabs,
      title,
      onEditTitle,
      onContentChange,
      canEditTitle,
      headerButtons,
      onHeaderButtonClick,
      t
    } = this.props;

    if (getChromeVersion() < 69) {
      return <BrowserVersionWarning version={69} color={brandColor} />;
    }

    return (
      <ThreeD
        brandColor={brandColor}
        ref={this.threedRef}
        initialContent={content}
        tabIndex={tabIndex}
        onTabChange={onTabChange}
        title={title}
        canEditTitle={canEditTitle}
        onEditTitle={onEditTitle}
        menuOptions={base => getMenuOptions(base, t)}
        addShapeGroups={base => [...base, ...addShapeGroups]}
        onMenuOptionClick={this.onMenuOptionClick}
        onContentChange={onContentChange}
        headerButtons={headerButtons}
        onHeaderButtonClick={onHeaderButtonClick}
      >
        {getTabs}
      </ThreeD>
    );
  }
}

export default withTranslate(ThreeDEditor);
