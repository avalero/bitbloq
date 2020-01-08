import { IResource } from "@bitbloq/api";
import { useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC } from "react";
import FilterOptions from "./FilterOptions";
import Paginator from "./Paginator";
import ResourcesGrid from "./ResourcesGrid";
import { OrderType } from "../types";

interface IResourcesListProps {
  addAllow?: boolean;
  addCallback?: (id: string, ext: string) => void;
  currentPage: number;
  moveToTrash: (id: string) => void;
  order: OrderType;
  pagesNumber: number;
  resources?: IResource[];
  restoreFromTrash: (id: string) => void;
  searchText: string;
  selectResource: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setOrder: (order: OrderType) => void;
  setSearchText: (value: string) => void;
}

const ResourcesList: FC<IResourcesListProps> = ({
  addAllow,
  addCallback,
  currentPage,
  moveToTrash,
  order,
  pagesNumber,
  resources = [],
  restoreFromTrash,
  searchText,
  selectResource,
  setCurrentPage,
  setOrder,
  setSearchText
}) => {
  const t = useTranslate();

  return (
    <Container>
      <FilterContainer>
        <FilterOptions
          searchText={searchText}
          onChange={(value: string) => setSearchText(value)}
          onOrderChange={setOrder}
          selectValue={order}
        />
      </FilterContainer>
      {searchText && resources.length === 0 ? (
        <EmptyResources>{t("cloud.text.no-result")}</EmptyResources>
      ) : (
        <ResourcesGrid
          addAllow={addAllow}
          addCallback={addCallback}
          moveToTrash={moveToTrash}
          resources={resources}
          restoreFromTrash={restoreFromTrash}
          selectResource={selectResource}
        />
      )}
      {pagesNumber > 1 && (
        <Paginator
          currentPage={currentPage}
          pages={pagesNumber}
          selectPage={(page: number) => setCurrentPage(page)}
        />
      )}
    </Container>
  );
};

export default ResourcesList;

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: space-between;
  width: 100%;

  & > * {
    flex-shrink: 0;
  }
`;

const EmptyResources = styled.div`
  align-items: center;
  color: #373b44;
  display: flex;
  flex: 1;
  font-size: 24px;
  font-weight: 300;
  justify-content: center;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;
