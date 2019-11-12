import styled from "@emotion/styled";
import React, { FC } from "react";
import ResourceCard from "./ResourceCard";
import { IResource } from "../types";

interface IResourcesGridProps {
  addAllow?: boolean;
  addCallback?: (id: string, ext: string) => void;
  className?: string;
  importResource?: boolean;
  moveToTrash?: (id: string) => void;
  resources: IResource[];
  restoreFromTrash?: (id: string) => void;
  selectResource?: (id: string) => void;
}

const ResourcesGrid: FC<IResourcesGridProps> = ({
  addAllow,
  addCallback,
  className,
  importResource,
  moveToTrash,
  resources,
  restoreFromTrash,
  selectResource
}) => (
  <Grid className={className} importResource={importResource}>
    {resources.map(resource => (
      <ResourceCard
        addAllow={addAllow}
        addCallback={addCallback}
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

const Grid = styled.div<{ importResource?: boolean }>`
  display: grid;
  flex: 1;
  grid-auto-rows: 130px;
  grid-column-gap: 20px;
  grid-template-columns: repeat(
    auto-fill,
    ${props => (props.importResource ? 140 : 160)}px
  );
  grid-row-gap: 20px;
  margin: 20px 0;
`;
