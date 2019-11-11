import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Modal, Icon, Input, Spinner, useTranslate } from "@bitbloq/ui";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslate();

  const onOpenSelect = () => {
    inputRef.current.click();
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
        <Tab active={tab === TabType.add} onClick={() => setTab(TabType.add)}>
          {t("cloud.upload.add")}
        </Tab>
      </Tabs>
      <Body>
        {tab === TabType.import ? (
          <ResourceInput>
            <input onChange={e => console.log(e)} ref={inputRef} type="file" />
            <Icon name="drag-file" />
            <p>{t("cloud.upload.drag")}</p>
            <SelectModalButton onClick={() => onOpenSelect()} tertiary>
              {t("cloud.upload.select")}
            </SelectModalButton>
          </ResourceInput>
        ) : (
          <></>
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
