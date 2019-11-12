import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
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

interface IResourceType {
  label: string;
  icon: string;
  id: string;
}

interface IResourceTypeProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

const ResourceType: FC<IResourceTypeProps> = ({
  active,
  label,
  icon,
  onClick
}) => {
  const t = useTranslate();

  return (
    <ResourceTypeItem active={active} onClick={onClick}>
      <Icon name={icon} />
      <p>{t(label)}</p>
    </ResourceTypeItem>
  );
};

export interface ICloudModalProps {
  acceptedExt?: string[];
  importAllow?: boolean;
  importCallback?: (id: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  setFile?: (file: File) => void;
}

const CloudModal: FC<ICloudModalProps> = ({
  acceptedExt,
  importAllow,
  importCallback,
  isOpen,
  onClose,
  setFile
}) => {
  const [moveToTrash] = useMutation(MOVE_RESOURCE_TO_TRASH);
  const [restoreFromTrash] = useMutation(RESTORE_RESOURCE_FROM_TRASH);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cloudResourceTypes, setCloudResourceTypes] = useState<IResourceType[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(OrderType.Creation);
  const [pagesNumber, setPagesNumber] = useState<number>(1);
  const [resources, setResources] = useState<IResource[]>([]);
  const [resourceTypeActiveId, setResourceTypeActiveId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedResource, setSelectedResource] = useState<
    IResource | undefined
  >();
  const { data, loading, refetch } = useQuery(GET_CLOUD_RESOURCES, {
    fetchPolicy: "network-only",
    variables: {
      deleted: resourceTypeActiveId === "deleted",
      currentPage,
      order,
      searchTitle: searchQuery,
      type: resourceTypeActiveId
    }
  });
  const t = useTranslate();

  useEffect(() => {
    for (let r in resourceTypes) {
      cloudResourceTypes.push(resourceTypes[r]);
    }
    setCloudResourceTypes(cloudResourceTypes);
    setResourceTypeActiveId(cloudResourceTypes[0].id);
  }, []);

  useEffect(() => {
    onSearchInput(searchText);
  }, [searchText]);

  useLayoutEffect(() => {
    if (!loading && data) {
      const { pagesNumber, resources } = data.cloudResources;
      setPagesNumber(pagesNumber || 1);
      setResources(resources || []);
    }
  }, [data]);

  const onChangeResourceType = (id: string) => {
    setCurrentPage(1);
    setOrder(OrderType.Creation);
    setResourceTypeActiveId(id);
    setSearchQuery("");
    setSearchText("");
    setSelectedResource(undefined);
  };

  const onMoveToTrash = async (id: string) => {
    await moveToTrash({
      variables: {
        id
      }
    });
    const { data } = await refetch();
    const { pagesNumber } = data.cloudResources;
    if (currentPage > pagesNumber) {
      setCurrentPage(pagesNumber);
      setPagesNumber(pagesNumber);
    }
  };

  const onRestoreFromTrash = async (id: string) => {
    await restoreFromTrash({
      variables: {
        id
      }
    });
    const { data } = await refetch();
    const { pagesNumber } = data.cloudResources;
    if (currentPage > pagesNumber) {
      setCurrentPage(pagesNumber);
      setPagesNumber(pagesNumber);
    }
  };

  const onSearchInput = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const onSelectResource = (resourceId: string) =>
    setSelectedResource(resources.find(resource => resource.id === resourceId));

  return (
    <Modal
      iconName="cloud-logo"
      isOpen={isOpen}
      onClose={onClose}
      title="Bitbloq Cloud"
    >
      <CloudModalBody>
        <LateralBar>
          {importAllow && (
            <>
              <ImportInput
                accept={acceptedExt.join(", ")}
                onChange={e => setFile(e.target.files[0])}
                ref={inputRef}
                type="file"
              />
              <ImportButton onClick={() => inputRef.current.click()}>
                {t("cloud.buttons.import")}
              </ImportButton>
            </>
          )}
          {cloudResourceTypes.map(resourceType => (
            <ResourceType
              active={resourceTypeActiveId === resourceType.id}
              key={resourceType.id}
              label={resourceType.label}
              icon={resourceType.icon}
              onClick={() => onChangeResourceType(resourceType.id)}
            />
          ))}
        </LateralBar>
        <MainContent>
          {loading ? (
            <ResourcesSpinner small />
          ) : selectedResource ? (
            <ResourceDetails
              {...selectedResource}
              returnCallback={() => setSelectedResource(undefined)}
            />
          ) : resources.length === 0 && !searchQuery ? (
            <EmptyResources>
              {resourceTypeActiveId === "resource-deleted"
                ? t("cloud.text.trash")
                : t("cloud.text.empty")}
            </EmptyResources>
          ) : (
            <ResourcesList
              currentPage={currentPage}
              importAllow={importAllow}
              importCallback={importCallback}
              moveToTrash={onMoveToTrash}
              pagesNumber={pagesNumber}
              order={order}
              resources={resources}
              restoreFromTrash={onRestoreFromTrash}
              searchText={searchText}
              selectResource={onSelectResource}
              setCurrentPage={setCurrentPage}
              setOrder={setOrder}
              setSearchText={setSearchText}
            />
          )}
        </MainContent>
      </CloudModalBody>
    </Modal>
  );
};

export default CloudModal;

const CloudModalBody = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 447px;
  width: 1000px;
`;

const EmptyResources = styled.div`
  align-items: center;
  color: #373b44;
  display: flex;
  font-size: 24px;
  font-weight: 300;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const ImportButton = styled(Button)`
  margin: 0 20px 20px;
  width: calc(100% - 40px);
`;

const ImportInput = styled.input`
  display: none;
`;

const LateralBar = styled.div`
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  height: 100%;
  padding-top: 21px;
  width: 258px;
`;

const MainContent = styled.div`
  box-sizing: border-box;
  flex: 1 1 auto;
  height: 100%;
  padding: 19px 20px 30px;
`;

const ResourcesSpinner = styled(Spinner)`
  height: 100%;
  width: 100%;
`;

const ResourceTypeItem = styled.div<{ active?: boolean }>`
  align-items: center;
  background-color: ${props => (props.active ? "#fff" : "#eee")};
  border-bottom: 1px solid #ddd;
  border-right: ${props =>
    props.active ? "1px solid #fff" : "1px solid #ddd"};
  cursor: pointer;
  display: flex;
  height: 40px;
  padding-left: 20px;
  width: calc(100% - 20px);

  &:first-of-type {
    border-top: 1px solid #ddd;
  }

  p {
    align-items: center;
    color: #373b44;
    display: flex;
    font-size: 14px;
    font-weight: bold;
    height: 16px;
  }

  svg {
    margin-right: 6px;
  }
`;
