import React, { FC, useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/react-hooks";
import { Button, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ResourcesGrid from "./ResourcesGrid";
import { GET_CLOUD_RESOURCES } from "../apollo/queries";
import { OrderType, ResourcesTypes } from "../types";
import { IResource } from "../../../api/src/api-types";

export enum TabType {
  add,
  import
}

export interface IUploadResourcTabsProps {
  acceptedExt: string[];
  acceptedTypes: ResourcesTypes[];
  addCallback: (id: string) => void;
  setFile: (file: File) => void;
  setTab: (tab: TabType) => void;
  tab: TabType;
}

const UploadResourcTabs: FC<IUploadResourcTabsProps> = ({
  acceptedExt,
  acceptedTypes,
  addCallback,
  setFile,
  setTab,
  tab
}) => {
  const [getResources, { called, data, loading }] = useLazyQuery(
    GET_CLOUD_RESOURCES,
    {
      fetchPolicy: "network-only",
      variables: {
        currentPage: 1,
        deleted: false,
        order: OrderType.Creation,
        searchTitle: "",
        type: acceptedTypes
      }
    }
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const [resources, setResources] = useState<IResource[]>([]);
  const t = useTranslate();

  useEffect(() => {
    if (called && !loading && data) {
      setResources(data.cloudResources.resources);
    }
  }, [data]);

  const onOpenSelect = () => {
    inputRef.current!.click();
  };

  return (
    <Container>
      <Tabs>
        <Tab
          active={tab === TabType.import}
          onClick={() => setTab(TabType.import)}
        >
          {t("cloud.upload.import")}
        </Tab>
        <Tab
          active={tab === TabType.add}
          onClick={() => {
            getResources();
            setTab(TabType.add);
          }}
        >
          {t("cloud.upload.add")}
        </Tab>
      </Tabs>
      <Body>
        {tab === TabType.import ? (
          <ResourceInput>
            <input
              accept={acceptedExt.join(", ")}
              onChange={e => setFile(e.target.files![0])}
              onClick={e => e.isTrusted && e.preventDefault()}
              ref={inputRef}
              type="file"
            />
            <Icon name="drag-file" />
            <p>{t("cloud.upload.drag")}</p>
            <SelectModalButton onClick={() => onOpenSelect()} tertiary>
              {t("cloud.upload.select")}
            </SelectModalButton>
          </ResourceInput>
        ) : resources.length > 0 ? (
          <UploadResourcesGrid
            addCallback={addCallback}
            resources={resources}
            importResource
          />
        ) : !called || loading ? (
          <EmptyImportedResources>
            <Spinner small />
          </EmptyImportedResources>
        ) : (
          <EmptyImportedResources>
            <h1>{t("cloud.text.empty-imported-title")}</h1>
            <p>{t("cloud.text.empty-imported-text")}</p>
          </EmptyImportedResources>
        )}
      </Body>
    </Container>
  );
};

export default UploadResourcTabs;

const Body = styled.div`
  box-sizing: border-box;
`;

const Container = styled.div`
  border: solid 1px #ddd;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
`;

const EmptyImportedResources = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  height: 324px;
  justify-content: center;
  width: 660px;

  h1 {
    color: #373b44;
    font-size: 24px;
    font-weight: 300;
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    color: #474749;
    font-size: 14px;
    line-height: 1.57;
    text-align: center;
  }
`;

const ResourceInput = styled.div`
  align-items: center;
  border: dashed 2px #979797;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  height: 200px;
  justify-content: space-between;
  margin: 20px;
  padding: 27px 0;
  position: relative;
  width: calc(100% - 40px);

  input {
    height: 100%;
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  p {
    color: #373b44;
    font-size: 14px;
    font-style: italic;
  }
`;

const SelectModalButton = styled(Button)`
  color: #373b44;
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.43;
  padding: 10px 20px;
  z-index: 2;
`;

const Tab = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${props => (props.active ? "#fff" : "#eee")};
  border-bottom: ${props => (props.active ? "" : "solid 1px #ddd")};
  color: #5d6069;
  cursor: ${props => (props.active ? "default" : "pointer")};
  display: flex;
  font-size: 14px;
  font-weight: bold;
  height: 100%;
  justify-content: center;
  width: 50%;
`;

const Tabs = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  height: 40px;
`;

const UploadResourcesGrid = styled(ResourcesGrid)`
  height: 284px;
  margin: 20px;
  width: 620px;
`;
