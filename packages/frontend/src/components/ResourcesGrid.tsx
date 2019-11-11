import styled from "@emotion/styled";
import React, { FC } from "react";
import ResourceCard from "./ResourceCard";
import { IResource } from "../types";

interface IResourcesGridProps {
  importResource?: boolean;
  moveToTrash: (id: string) => void;
  resources: IResource[];
  restoreFromTrash: (id: string) => void;
  selectResource: (id: string) => void;
}

const ResourcesGrid: FC<IResourcesGridProps> = ({
  importResource,
  moveToTrash,
  resources,
  restoreFromTrash,
  selectResource
}) => (
  <Grid>
    {resources.map(resource => (
      <ResourceCard
        importResource={importResource}
        key={resource.id}
        moveToTrash={moveToTrash}
        {...resource}
        restoreFromTrash={restoreFromTrash}
        selectResource={selectResource}
      />
    ))}
  </Grid>
);

export default ResourcesGrid;

const Grid = styled.div`
  display: grid;
  flex: 1;
  grid-auto-rows: 132px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-row-gap: 20px;
  margin: 20px 0;
`;
