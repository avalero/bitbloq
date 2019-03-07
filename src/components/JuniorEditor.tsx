import React from "react";
import { Junior } from "@bitbloq/junior";

interface JuniorEditorProps {
  brandColor: string;
  tabIndex: number;
  onTabChange: (number) => any;
  getTabs: (any) => any;
  title: string;
  onEditTitle?: () => any;
  canEditTitle: boolean;
}

const JuniorEditor = ({ brandColor, tabIndex, onTabChange, getTabs, title, onEditTitle, canEditTitle }) => {
  return (
    <Junior
      brandColor={brandColor}
      tabIndex={tabIndex}
      onTabChange={onTabChange}
      title={title}
      onEditTitle={onEditTitle}
      canEditTitle={canEditTitle}
    >
      {getTabs}
    </Junior>
  );
};

export default JuniorEditor;
