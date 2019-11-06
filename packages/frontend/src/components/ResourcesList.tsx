import styled from "@emotion/styled";
import debounce from "lodash/debounce";
import React, { FC, useState } from "react";
import FilterOptions from "./FilterOptions";
import Paginator from "./Paginator";
import { OrderType } from "../config";

interface IResourcesListProps {
  resources?: any[]; // Crear tipo IResource
  setResources?: () => void;
}

const ResourcesList: FC<IResourcesListProps> = ({
  resources = [],
  setResources
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [order, setOrder] = useState<OrderType>(OrderType.Creation);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");

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
      <List></List>
      <Paginator
        currentPage={currentPage}
        pages={3}
        selectPage={(page: number) => setCurrentPage(page)}
      />
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
`;

const FilterContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const List = styled.div`
  display: grid;
  grid-auto-rows: 132px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 20px;
`;
