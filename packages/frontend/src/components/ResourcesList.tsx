import { useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import debounce from "lodash/debounce";
import React, { FC, useState } from "react";
import FilterOptions from "./FilterOptions";
import Paginator from "./Paginator";
import ResourceCard from "./ResourceCard";
import { OrderType } from "../config";
import { IResource } from "../types";

interface IResourcesListProps {
  currentPage: number;
  pagesNumber: number;
  resources?: IResource[];
  selectResource: (id: string) => void;
  setCurrentPage: (page: number) => void;
  setOrder: (order: OrderType) => void;
  setSearchQuery: (value: string) => void;
}

const ResourcesList: FC<IResourcesListProps> = ({
  currentPage,
  pagesNumber,
  resources = [],
  selectResource,
  setCurrentPage,
  setOrder,
  setSearchQuery
}) => {
  const [searchText, setSearchText] = useState("");
  const t = useTranslate();

  const onSearchInput = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  return (
    <Container>
      <FilterContainer>
        <FilterOptions
          searchText={searchText}
          onChange={(value: string) => (
            setSearchText(value), onSearchInput(value)
          )}
          onOrderChange={(order: OrderType) => setOrder(order)}
        />
      </FilterContainer>
      {searchText && resources.length === 0 ? (
        <EmptyResources>{t("cloud.text.no-result")}</EmptyResources>
      ) : (
        <List>
          {resources.map(resource => (
            <ResourceCard
              key={resource.id}
              {...resource}
              selectResource={selectResource}
            />
          ))}
        </List>
      )}
      {resources.length > 8 && (
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
  font-family: Roboto;
  font-size: 24px;
  font-weight: 300;
  justify-content: center;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const List = styled.div`
  display: grid;
  flex: 1;
  grid-auto-rows: 132px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 20px;
  margin: 20px 0;
`;
