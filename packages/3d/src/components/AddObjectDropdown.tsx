import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, ScrollableTabs, useTranslate } from "@bitbloq/ui";
import { IShape, IShapeGroup } from "../types";

export interface IAddObjectDropDownProps {
  shapeGroups: IShapeGroup[];
  onAddObject: (shapeConfig: IShape) => any;
}

const AddObjectDropdown: FC<IAddObjectDropDownProps> = ({
  shapeGroups,
  onAddObject
}) => {
  const t = useTranslate();

  return (
    <Tabs
      tabs={shapeGroups
        .filter(group => group.shapes && group.shapes.length > 0)
        .map(group => ({
          icon: group.icon,
          bottom: group.resources,
          content: (
            <ShapeGroup>
              <GroupLabel>{t(group.label)}</GroupLabel>
              <Shapes>
                {group.shapes.map(shape => (
                  <Shape key={shape.label} onClick={() => onAddObject(shape)}>
                    <ShapeImage resource={!!group.resources}>
                      {shape.icon}
                    </ShapeImage>
                    <ShapeText>{t(shape.label)}</ShapeText>
                  </Shape>
                ))}
              </Shapes>
            </ShapeGroup>
          )
        }))}
    />
  );
};

export default React.memo(AddObjectDropdown);

/* styled components */

const Tabs = styled(ScrollableTabs)`
  width: 380px;
  height: 400px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;

const ShapeGroup = styled.div`
  padding: 20px;
  box-sizing: border-box;
  &:last-of-type {
    min-height: 400px;
  }
`;

const GroupLabel = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const Shapes = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const Shape = styled.div`
  cursor: pointer;
`;

const ShapeImage = styled.div<{ resource: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background-color: ${props => (props.resource ? "#fff" : "#def6fb")};
  display: flex;
  justify-content: center;
  align-items: center;

  svg,
  img {
    color: ${props => (props.resource ? "#c0c3c9" : "")};
    width: ${props => (props.resource ? 80 : 56)}px;
    height: ${props => (props.resource ? 80 : 56)}px;
  }
`;

const ShapeText = styled.div`
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  font-size: 14px;
  margin-top: 4px;
  overflow: hidden;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  word-break: break-word;
`;
