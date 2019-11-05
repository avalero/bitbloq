import React, { FC, useState } from "react";
import { Modal, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import Paginator from "./Paginator";
import { resourceTypes } from "../config";

interface IResourcesListProps {
  resources?: any[]; // Crear tipo IResource
  setResources?: () => void;
}

const ResourcesList: FC<IResourcesListProps> = ({
  resources = [],
  setResources
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const t = useTranslate();

  return (
    <Container>
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

const List = styled.div`
  display: grid;
  grid-auto-rows: 132px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 20px;
`;
