import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Modal, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import debounce from "lodash/debounce";
import ResourceDetails from "./ResourceDetails";
import ResourcesList from "./ResourcesList";
import {
  GET_CLOUD_RESOURCES,
  MOVE_RESOURCE_TO_TRASH,
  RESTORE_RESOURCE_FROM_TRASH
} from "../apollo/queries";
import { resourceTypes } from "../config";
import { IResource, OrderType } from "../types";

export enum TabType {
  add,
  import
}

export interface IUploadResourcTabsProps {
  setTab: (tab: TabType) => void;
  tab: TabType;
}

const UploadResourcTabs: FC<IUploadResourcTabsProps> = ({ setTab, tab }) => {
  const t = useTranslate();

  return (
    <Container>
      <Tabs>
        <Tab
          active={tab === TabType.import}
          onClick={() => setTab(TabType.import)}
        >
          {t("cloud.upload.import")}
        </Tab>
        <Tab active={tab === TabType.add} onClick={() => setTab(TabType.add)}>
          {t("cloud.upload.add")}
        </Tab>
      </Tabs>
      <Body></Body>
    </Container>
  );
};

export default UploadResourcTabs;

const Body = styled.div`
  box-sizing: border-box;
  flex: 1;
`;

const Container = styled.div`
  border: solid 1px #ddd;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  height: 280px;
`;

const Tab = styled.div<{ active: boolean }>`
  align-items: center;
  background-color: ${props => (props.active ? "#fff" : "#eee")};
  border-bottom: ${props => (props.active ? "" : "solid 1px #ddd")};
  color: #5d6069;
  cursor: pointer;
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
