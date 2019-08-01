import * as React from "react";
import { ThreeD } from "@bitbloq/3d";
import { colors, Icon, withTranslate } from "@bitbloq/ui";
import { addShapeGroups } from "../config";
import BrowserVersionWarning from "./BrowserVersionWarning";
import ExportSTLModal from "./ExportSTLModal";
import { getChromeVersion } from "../util";
import { EditorProps } from "../types";

const getMenuOptions = (baseMenuOptions, t) => [
  {
    id: "file",
    label: t("menu-file"),
    children: [
      {
        id: "new-document",
        label: t("menu-new-document"),
        icon: <Icon name="new-document" />
      },
      {
        id: "open-document",
        label: t("menu-open-document"),
        icon: <Icon name="open-document" />
      },
      {
        id: "change-name",
        label: t("menu-change-name"),
        icon: <Icon name="pencil" />
      },
      {
        id: "duplicate-document",
        label: t("menu-duplicate-document"),
        icon: <Icon name="duplicate" />
      },
      {
        divider: true
      },
      {
        id: "import-stl",
        label: t("menu-import-stl"),
        icon: <Icon name="import-stl" />
      },
      {
        divider: true
      },
      {
        id: "download-document",
        label: t("menu-download-document"),
        icon: <Icon name="download-document" />
      },
      {
        id: "download-stl",
        label: t("menu-export-stl"),
        icon: <Icon name="export-stl" />
      },
      {
        divider: true
      },
      {
        id: "change-language",
        label: t("menu-change-language"),
        icon: <Icon name="earth" />
      },
      {
        divider: true
      },
      {
        id: "delete-document",
        label: t("menu-delete-document"),
        icon: <Icon name="trash" />
      }
    ]
  },
  ...baseMenuOptions
];

class ThreeDEditor extends React.Component<EditorProps> {
  threedRef = React.createRef<ThreeD>();

  readonly state = {
    showExportModal: false
  };

  onMenuOptionClick = option => {
    const { onSaveDocument } = this.props;

    switch (option.id) {
      case "download-document":
        onSaveDocument && onSaveDocument();
        return;

      case "download-stl":
        this.setState({ showExportModal: true });
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
    const { showExportModal } = this.state;

    if (getChromeVersion() < 69) {
      return <BrowserVersionWarning version={69} color={brandColor} />;
    }

    return (
      <>
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
        {showExportModal &&
          <ExportSTLModal
            onCancel={() => this.setState({ showExportModal: false })}
            onSave={(name, separate) => {
              this.setState({ showExportModal: false });
              this.threedRef.current.exportToSTL(name, separate);
            }}
          />
        }
      </>
    );
  }
}

export default withTranslate(ThreeDEditor);
