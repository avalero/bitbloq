import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { useQuery } from "@apollo/react-hooks";
import { colors, Spinner, Document, useTranslate, Icon } from "@bitbloq/ui";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { documentTypes } from "../config";
import { SUBMISSION_QUERY } from "../apollo/queries";

interface IViewSubmissionProps {
  id: string;
  type: string;
}

const ViewSubmission: FC<IViewSubmissionProps> = ({ id, type }) => {
  const t = useTranslate();
  const [tabIndex, setTabIndex] = useState(0);
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;
  const { data, loading, error } = useQuery(SUBMISSION_QUERY, {
    variables: { id }
  });

  if (loading) return <Loading color={documentType.color} />;
  if (error) return <GraphQLErrorMessage apolloError={error!} />;

  const { submission } = data;
  const { title, studentNick } = submission;

  const menuOptions = [
    {
      id: "file",
      label: t("menu-file"),
      children: []
    }
  ];

  return (
    <EditorComponent
      document={submission}
      onDocumentChange={() => null}
      baseTabs={[]}
      baseMenuOptions={menuOptions}
    >
      {documentProps => (
        <Document
          icon={<Icon name={documentType.icon} />}
          brandColor={documentType.color}
          tabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabs={(mainTabs: any[]) => mainTabs}
          title={`${title} (${studentNick})`}
          {...documentProps}
        />
      )}
    </EditorComponent>
  );
};

export default ViewSubmission;

/* styled components */

const Loading = styled(Spinner)<{ color: string }>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
`;
